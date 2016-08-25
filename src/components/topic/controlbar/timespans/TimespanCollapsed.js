import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeHelpfulContainer from '../../../common/HelpfulContainer';
import messages from '../../../../resources/messages';

const localMessages = {
  showTimespans: { id: 'timespans.show', defaultMessage: 'Show Timespans' },
};

const TimespanCollapsed = (props) => {
  const { timespan, onExpand, helpButton } = props;
  const { formatMessage } = props.intl;
  return (
    <div className="collapsed">
      <Grid>
        <Row>
          <Col lg={2} md={2} sm={0} />
          <Col lg={8} md={8} sm={6} className="center">
            {timespan.start_date.substr(0, 10)} to {timespan.end_date.substr(0, 10)}
          </Col>
          <Col lg={2} md={2} sm={6} >
            <div className="toggle-control">
              <a href={`#${formatMessage(localMessages.showTimespans)}`} onClick={onExpand}>
                <FormattedMessage {...localMessages.showTimespans} />
              </a>
              {helpButton}
            </div>
          </Col>
        </Row>
      </Grid>
    </div>
  );
};

TimespanCollapsed.propTypes = {
  intl: React.PropTypes.object.isRequired,
  timespan: React.PropTypes.object.isRequired,
  onExpand: React.PropTypes.func.isRequired,
  helpButton: React.PropTypes.node.isRequired,
};

export default
  injectIntl(
    composeHelpfulContainer(messages.timespansHelpTitle, messages.timespansHelpText)(
      TimespanCollapsed
    )
  );
