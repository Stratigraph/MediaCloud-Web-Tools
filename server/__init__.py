import os
import logging
import logging.config
import ConfigParser
import json
import sys
from flask import Flask, render_template
from flask_webpack import Webpack
from flask_mail import Mail
import flask_login
from flask_cors import CORS
from raven.conf import setup_logging
from raven.contrib.flask import Sentry
from raven.handlers.logging import SentryHandler
import mediacloud
from mediameter.cliff import Cliff

from server.database import AppDatabase

SERVER_MODE_DEV = "dev"
SERVER_MODE_PROD = "prod"
SERVER_APP_TOPICS = "topics"
SERVER_APP_SOURCES = "sources"

base_dir = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# load the shared settings file
server_config_file_path = os.path.join(base_dir, 'config', 'server.config')
settings = ConfigParser.ConfigParser()
settings.read(server_config_file_path)

# Set up some logging
try:
    entry = Sentry(dsn=settings.get('sentry', 'dsn'))
    handler = SentryHandler(settings.get('sentry', 'dsn'))
    setup_logging(handler)
except Exception:
    print "no sentry logging"

with open(os.path.join(base_dir, 'config', 'server-logging.json'), 'r') as f:
    logging_config = json.load(f)
    logging_config['handlers']['file']['filename'] = os.path.join(base_dir, logging_config['handlers']['file']['filename'])
logging.config.dictConfig(logging_config)
logger = logging.getLogger(__name__)
logger.info("---------------------------------------------------------------------------")
flask_login_logger = logging.getLogger('flask_login')
flask_login_logger.setLevel(logging.DEBUG)

server_mode = settings.get('server', 'mode').lower()
if server_mode not in [SERVER_MODE_DEV, SERVER_MODE_PROD]:
    logger.error("Unknown server mode '%s', set a mode in the `config/server.config` file", server_mode)
    sys.exit(1)
else:
    logger.info("Started server in %s mode", server_mode)

# Connect to MediaCloud
mc = mediacloud.api.AdminMediaCloud(settings.get('mediacloud', 'api_key'))
logger.info("Connected to mediacloud")

# Connect to CLIFF if the settings are there
cliff = None
try:
    cliff = Cliff(settings.get('cliff', 'host'), settings.get('cliff', 'port'))
except Exception:
    logger.warn("no CLIFF connection")

# Connect to the app's mongo DB
db_host = settings.get('database', 'host')
db_name = settings.get('database', 'name')
db = AppDatabase(db_host, db_name)

try:
    db.check_connection()
except Exception as err:
    print("DB error: {0}".format(err))
    print("Make sure Mongo is running")
    sys.exit()

logger.info("Connected to DB: %s@%s", db_name, db_host)

def isDevMode():
    return server_mode == SERVER_MODE_DEV

def isProdMode():
    return server_mode == SERVER_MODE_PROD

webpack = Webpack()
mail = Mail()

def create_app():
    '''
    Factory method to create the app
    '''
    prod_app = settings.get('server', 'app')
    my_app = Flask(__name__)
    # set up webpack
    webpack_config = {
        'DEBUG': isDevMode(),
        'WEBPACK_MANIFEST_PATH': '../build/manifest.json' if isDevMode() else '../server/static/gen/'+prod_app+'/manifest.json'
    }
    my_app.config.update(webpack_config)
    webpack.init_app(my_app)
    # set up mail sending
    if settings.has_option('smtp', 'enabled'):
        mail_enabled = settings.get('smtp', 'enabled')
        if mail_enabled is '1':
            mail_config = {     # @see https://pythonhosted.org/Flask-Mail/
                'MAIL_SERVER': settings.get('smtp', 'server'),
                'MAIL_PORT': settings.get('smtp', 'port'),
                'MAIL_USE_SSL': settings.get('smtp', 'use_ssl'),
                'MAIL_USERNAME': settings.get('smtp', 'username'),
                'MAIL_PASSWORD': settings.get('smtp', 'password'),
            }
            my_app.config.update(mail_config)
            mail.init_app(my_app)
            logger.info('Mailing from '+settings.get('smtp', 'username')+' via '+settings.get('smtp', 'server'))
        else:
            logger.info("Mail configured, but not enabled")
    else: 
        logger.info("No mail configured")
    return my_app

app = create_app()
app.secret_key = settings.get('server', 'secret_key')

CORS(app,
    resources=r'/*',
    supports_credentials=True,
    allow_headers='Content-Type'
)

# Create user login manager
login_manager = flask_login.LoginManager()
login_manager.init_app(app)

# set up all the views

@app.route('/')
def index():
    logger.debug("homepage request")
    return render_template('index.html')

# now load in the appropriate view endpoints (only on Prod)
import server.views.user
import server.views.stat
server_app = settings.get('server', 'app')
if (server_app == SERVER_APP_SOURCES) or isDevMode():
    import server.views.sources.collection
    import server.views.sources.source
    import server.views.sources.sentences
    import server.views.sources.words
    import server.views.sources.geocount
    import server.views.sources.search
    import server.views.sources.metadata
if (server_app == SERVER_APP_TOPICS) or isDevMode():
    import server.views.topics.media
    import server.views.topics.sentences
    import server.views.topics.stories
    import server.views.topics.topic
    import server.views.topics.words
    import server.views.topics.focalsets
    import server.views.topics.foci
    import server.views.topics.permissions
    import server.views.topics.maps
