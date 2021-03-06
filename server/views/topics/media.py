import logging
import json
from flask import jsonify, request
import flask_login

from server import app, TOOL_API_KEY
from server.views import WORD_COUNT_DOWNLOAD_LENGTH
from server.auth import user_mediacloud_key, user_admin_mediacloud_client, is_user_logged_in
from server.util import csv
from server.util.tags import is_metadata_tag_set, format_metadata_fields
from server.views.topics import validated_sort, TOPICS_TEMPLATE_PROPS
from server.views.topics.splitstories import stream_topic_split_story_counts_csv, topic_split_story_count
from server.views.topics.stories import stream_story_list_csv
import server.views.topics.apicache as apicache
from server.util.request import filters_from_args, api_error_handler
from server.views.topics import access_public_topic


logger = logging.getLogger(__name__)


@app.route('/api/topics/<topics_id>/media', methods=['GET'])
@api_error_handler
def topic_media(topics_id):
    if access_public_topic(topics_id):
        media_list = apicache.topic_media_list(TOOL_API_KEY, topics_id, snapshots_id=None, timespans_id=None,
                                               foci_id=None, sort=None, limit=None, link_id=None)
    elif is_user_logged_in():
        media_list = apicache.topic_media_list(user_mediacloud_key(), topics_id)
    else:
        return jsonify({'status': 'Error', 'message': 'Invalid attempt'})

    return jsonify(media_list)


@app.route('/api/topics/<topics_id>/media/<media_id>', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media(topics_id, media_id):
    user_mc = user_admin_mediacloud_client()
    combined_media_info = apicache.topic_media_list(user_mediacloud_key(), topics_id, media_id=media_id)['media'][0]
    media_info = user_mc.media(media_id)
    for key in media_info.keys():
        if key not in combined_media_info.keys():
            combined_media_info[key] = media_info[key]
    return jsonify(combined_media_info)


@app.route('/api/topics/<topics_id>/media.csv', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_media_csv(topics_id):
    sort = validated_sort(request.args.get('sort'))
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    return _stream_media_list_csv(user_mediacloud_key(), 'media-for-topic-' + topics_id, topics_id, sort=sort,
                                  snapshots_id=snapshots_id, timespans_id=timespans_id, foci_id=foci_id, q=q)


@app.route('/api/topics/<topics_id>/media/<media_id>/split-story/count', methods=['GET'])
@flask_login.login_required
@api_error_handler
def topic_media_split_story_count(topics_id, media_id):
    return jsonify(apicache.topic_split_story_counts(user_mediacloud_key(), topics_id))


@app.route('/api/topics/<topics_id>/media/<media_id>/split-story/count.csv', methods=['GET'])
@flask_login.login_required
def topic_media_story_split_count_csv(topics_id, media_id):
    return stream_topic_split_story_counts_csv(user_mediacloud_key(), 'media-'+str(media_id)+'-split-story-counts',
                                     topics_id, fq="media_id:"+media_id)


@app.route('/api/topics/<topics_id>/media/<media_id>/stories', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_stories(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    stories = apicache.topic_story_list(user_mediacloud_key(), topics_id,
                               media_id=media_id, sort=sort, limit=limit)
    return jsonify(stories)


@app.route('/api/topics/<topics_id>/media/<media_id>/stories.csv', methods=['GET'])
@flask_login.login_required
def media_stories_csv(topics_id, media_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    return stream_story_list_csv(user_mediacloud_key(), 'media-'+media_id+'-stories', topics_id,
                                 media_id=media_id, timespans_id=timespans_id, q=q)


@app.route('/api/topics/<topics_id>/media/<media_id>/inlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_inlinks(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    inlinks = apicache.topic_story_list(user_mediacloud_key(), topics_id,
                               link_to_media_id=media_id, sort=sort, limit=limit)
    return jsonify(inlinks)


@app.route('/api/topics/<topics_id>/media/<media_id>/inlinks.csv', methods=['GET'])
@flask_login.login_required
def media_inlinks_csv(topics_id, media_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    return stream_story_list_csv(user_mediacloud_key(), 'media-'+media_id+'-inlinks', topics_id,
                                 link_to_media_id=media_id, timespans_id=timespans_id, q=q)


@app.route('/api/topics/<topics_id>/media/<media_id>/outlinks', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_outlinks(topics_id, media_id):
    sort = validated_sort(request.args.get('sort'))
    limit = request.args.get('limit')
    outlinks = apicache.topic_story_list(user_mediacloud_key(), topics_id,
                                link_from_media_id=media_id, sort=sort, limit=limit)
    return jsonify(outlinks)


@app.route('/api/topics/<topics_id>/media/<media_id>/outlinks.csv', methods=['GET'])
@flask_login.login_required
def media_outlinks_csv(topics_id, media_id):
    snapshots_id, timespans_id, foci_id, q = filters_from_args(request.args)
    return stream_story_list_csv(user_mediacloud_key(), 'media-'+media_id+'-outlinks', topics_id,
                                 link_from_media_id=media_id, timespans_id=timespans_id, q=q)


def _stream_media_list_csv(user_mc_key, filename, topics_id, **kwargs):
    # Helper method to stream a list of media back to the client as a csv.  Any args you pass in will be
    # simply be passed on to a call to topicMediaList.
    add_metadata = False  # off for now because this is SUPER slow
    all_media = []
    more_media = True
    params = kwargs
    params['limit'] = 1000  # an arbitrary value to let us page through with big pages
    try:
        cols_to_export = TOPICS_TEMPLATE_PROPS
        if not add_metadata:
            cols_to_export = cols_to_export[:-4]    # remove the metadata cols

        while more_media:
            page = apicache.topic_media_list(user_mediacloud_key(), topics_id, **params)
            media_list = page['media']
            user_mc = user_admin_mediacloud_client()

            if add_metadata:
                for media_item in media_list:
                    media_info = user_mc.media(media_item['media_id'])
                    for eachItem in media_info['media_source_tags']:
                        if is_metadata_tag_set(eachItem['tag_sets_id']):
                            format_metadata_fields(media_item, eachItem)

            all_media = all_media + media_list

            if 'next' in page['link_ids']:
                params['link_id'] = page['link_ids']['next']
                more_media = True
            else:
                more_media = False

        return csv.download_media_csv(all_media, filename, cols_to_export)
    except Exception as exception:
        return json.dumps({'error': str(exception)}, separators=(',', ':')), 400


@app.route('/api/topics/<topics_id>/media/<media_id>/words', methods=['GET'])
@flask_login.login_required
@api_error_handler
def media_words(topics_id, media_id):
    query = apicache.add_to_user_query('media_id:'+media_id)
    word_list = apicache.topic_word_counts(user_mediacloud_key(), topics_id, q=query)[:100]
    return jsonify(word_list)


@app.route('/api/topics/<topics_id>/media/<media_id>/words.csv', methods=['GET'])
@flask_login.login_required
def media_words_csv(topics_id, media_id):
    query = apicache.add_to_user_query('media_id:'+media_id)
    ngram_size = request.args['ngram_size'] if 'ngram_size' in request.args else 1  # default to word count
    word_counts = apicache.topic_ngram_counts(user_mediacloud_key(), topics_id, ngram_size=ngram_size, q=query,
                                     num_words=WORD_COUNT_DOWNLOAD_LENGTH)
    return csv.stream_response(word_counts, apicache.WORD_COUNT_DOWNLOAD_COLUMNS,
                               'topic-{}-media-{}-sampled-ngrams-{}-word'.format(topics_id, media_id, ngram_size))
