import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, FormattedHTMLMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import { fetchTopicEntitiesOrgs, filterByQuery } from '../../../actions/topicActions';
import DataCard from '../../common/DataCard';
import EntitiesTable from '../../common/EntitiesTable';
import { filtersAsUrlParams, filteredLocation } from '../../util/location';
import { DownloadButton } from '../../common/IconButton';
import messages from '../../../resources/messages';
import composeHelpfulContainer from '../../common/HelpfulContainer';

const COVERAGE_REQUIRED = 0.7;
const NUMBER_TO_SHOW = 10;

const localMessages = {
  title: { id: 'topic.snapshot.topOrgs.title', defaultMessage: 'Top {number} Organizations' },
  notEnoughData: { id: 'topic.snapshot.topOrgs.notEnoughData',
    defaultMessage: '<i>Sorry, but only {pct} of the stories have been processed to add the organizations they mention.  We can\'t gaurantee the accuracy of partial results, so we don\'t show a table of results here.  If you are really curious, you can download the CSV using the link in the top-right of this box, but don\'t trust those numbers as fully accurate. Email us if you want us to process this topic to add the organizations mentioned.</i>',
  },
};

class TopOrgsContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, fetchData } = this.props;
    if (nextProps.filters !== filters) {
      fetchData(nextProps.topicId, nextProps.filters);
    }
  }
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/entities/organizations/entities.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  handleEntityClick = (tagId) => {
    const { filters, updateQueryFilter } = this.props;
    const queryFragment = `tags_id_stories: ${tagId}`;
    if (filters.q && filters.q.length > 0) {
      updateQueryFilter(`(${filters.q}) AND (${queryFragment})`);
    } else {
      updateQueryFilter(queryFragment);
    }
  }
  render() {
    const { coverage, entities, helpButton } = this.props;
    const { formatNumber, formatMessage } = this.props.intl;
    let content = null;
    const coverageRatio = coverage.count / coverage.total;
    if (coverageRatio > COVERAGE_REQUIRED) {
      content = <EntitiesTable entities={entities.slice(0, NUMBER_TO_SHOW)} onClick={(...args) => this.handleEntityClick(args)} />;
    } else {
      content = (
        <p>
          <FormattedHTMLMessage
            {...localMessages.notEnoughData}
            values={{
              pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }),
            }}
          />
        </p>
      );
    }
    return (
      <DataCard>
        <div className="actions">
          <DownloadButton tooltip={formatMessage(messages.download)} onClick={this.downloadCsv} />
        </div>
        <h2>
          <FormattedMessage {...localMessages.title} values={{ number: NUMBER_TO_SHOW }} />
          {helpButton}
        </h2>
        {content}
      </DataCard>
    );
  }
}

TopOrgsContainer.propTypes = {
  // from compositional chain
  location: PropTypes.object.isRequired,
  intl: PropTypes.object.isRequired,
  helpButton: PropTypes.node.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  // from dispatch
  asyncFetch: PropTypes.func.isRequired,
  fetchData: PropTypes.func.isRequired,
  // from state
  coverage: PropTypes.object.isRequired,
  entities: PropTypes.array.isRequired,
  fetchStatus: PropTypes.string.isRequired,
  updateQueryFilter: PropTypes.func.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topEntitiesOrgs.fetchStatus,
  coverage: state.topics.selected.summary.topEntitiesOrgs.coverage,
  entities: state.topics.selected.summary.topEntitiesOrgs.entities,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (topicId, filters) => {
    dispatch(fetchTopicEntitiesOrgs(topicId, filters));
  },
  updateQueryFilter: (newQueryFilter) => {
    const newFilters = {
      ...ownProps.filters,
      q: newQueryFilter,
    };
    const newLocation = filteredLocation(ownProps.location, newFilters);
    dispatch(push(newLocation));
    dispatch(filterByQuery(newQueryFilter));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData(ownProps.topicId, ownProps.filters);
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeHelpfulContainer(messages.entityHelpTitle, messages.entityHelpContent)(
        composeAsyncContainer(
          TopOrgsContainer
        )
      )
    )
  );
