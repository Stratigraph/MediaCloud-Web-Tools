import React from 'react';
import Title from 'react-title-component';
import Link from 'react-router/lib/Link';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import { fetchSourceSuggestions } from '../../../../actions/sourceActions';
import composeAsyncContainer from '../../../common/AsyncContainer';
import SourceSuggestion from './SourceSuggestion';

const localMessages = {
  title: { id: 'sources.suggestions.pending.title', defaultMessage: 'Pending Suggestions' },
  intro: { id: 'sources.suggestions.pending.intro', defaultMessage: 'Here is a list of media source suggestions made by users.  Approve or reject them as you see fit!' },
  history: { id: 'sources.suggestions.pending.historyLink', defaultMessage: 'See a full history of suggestions.' },
};

const PendingSuggestionsContainer = (props) => {
  const { suggestions } = props;
  const { formatMessage } = props.intl;
  const titleHandler = parentTitle => `${formatMessage(localMessages.title)} | ${parentTitle}`;
  return (
    <Grid>
      <Row>
        <Col lg={12} md={12} sm={12}>
          <Title render={titleHandler} />
          <h1><FormattedMessage {...localMessages.title} /></h1>
          <p><FormattedMessage {...localMessages.intro} /></p>
          <p>
            <Link to="/sources/suggestions/history">
              <FormattedMessage {...localMessages.history} />
            </Link>
          </p>
        </Col>
      </Row>
      <Row>
        { suggestions.map(s => (
          <Col key={s.media_suggestions_id} lg={4} >
            <SourceSuggestion suggestion={s} markable />
          </Col>
        ))}
      </Row>
    </Grid>
  );
};

PendingSuggestionsContainer.propTypes = {
  // from the composition chain
  intl: React.PropTypes.object.isRequired,
  // from parent
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  suggestions: React.PropTypes.array.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.sources.sources.suggestions.fetchStatus,
  suggestions: state.sources.sources.suggestions.list,
});

const mapDispatchToProps = dispatch => ({
  asyncFetch: () => {
    dispatch(fetchSourceSuggestions({ all: false }));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeAsyncContainer(
        PendingSuggestionsContainer
      )
    )
  );