import PropTypes from 'prop-types';
import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { push } from 'react-router-redux';
import MenuItem from 'material-ui/MenuItem';
import composeAsyncContainer from '../../common/AsyncContainer';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import { fetchTopicTopStories, sortTopicTopStories, filterByFocus } from '../../../actions/topicActions';
import { addNotice } from '../../../actions/appActions';
import DataCard from '../../common/DataCard';
import Permissioned from '../../common/Permissioned';
import LinkWithFilters from '../LinkWithFilters';
import { getUserRoles, hasPermissions, PERMISSION_LOGGED_IN } from '../../../lib/auth';
import { LEVEL_INFO } from '../../common/Notice';
import { ExploreButton, DownloadButton } from '../../common/IconButton';
import ActionMenu from '../../common/ActionMenu';
import TopicStoryTable from '../TopicStoryTable';
import messages from '../../../resources/messages';
import { filteredLinkTo, filteredLocation, filtersAsUrlParams } from '../../util/location';
import { HELP_STORIES_CSV_COLUMNS } from '../../../lib/helpConstants';

const localMessages = {
  title: { id: 'topic.summary.stories.title', defaultMessage: 'Top Stories' },
  descriptionIntro: { id: 'topic.summary.stories.help.title', defaultMessage: 'The top stories within this topic can suggest the main ways it is talked about.  Sort by different measures to get a better picture of a story\'s influence.' },
  downloadNoFBData: { id: 'topic.summary.stories.download.noFB', defaultMessage: 'Download Csv' },
  downloadWithFBData: { id: 'topic.summary.stories.download.withFB', defaultMessage: 'Download CSV w/Facebook collection date (takes longer)' },
};

const NUM_TO_SHOW = 10;

class StoriesSummaryContainer extends React.Component {
  componentWillReceiveProps(nextProps) {
    const { filters, sort, fetchData } = this.props;
    if ((nextProps.filters !== filters) || (nextProps.sort !== sort)) {
      fetchData(nextProps);
    }
  }
  onChangeSort = (newSort) => {
    const { sortData } = this.props;
    sortData(newSort);
  };
  downloadCsvNoFBData = () => {
    const { filters, sort, topicId, addAppNotice } = this.props;
    const url = `/api/topics/${topicId}/stories.csv?${filtersAsUrlParams(filters)}&sort=${sort}`;
    window.location = url;
    addAppNotice();
  }
  downloadCsvWithFBData = () => {
    const { filters, sort, topicId, addAppNotice } = this.props;
    const url = `/api/topics/${topicId}/stories.csv?${filtersAsUrlParams(filters)}&sort=${sort}&fbData=1`;
    window.location = url;
    addAppNotice();
  }
  render() {
    const { stories, sort, topicId, filters, handleFocusSelected, user, showTweetCounts } = this.props;
    const { formatMessage } = this.props.intl;
    const exploreUrl = `/topics/${topicId}/stories`;
    const isLoggedIn = hasPermissions(getUserRoles(user), PERMISSION_LOGGED_IN);
    return (
      <DataCard className="topic-summary-top-stories">
        <Permissioned onlyRole={PERMISSION_LOGGED_IN}>
          <div className="actions">
            <ExploreButton linkTo={filteredLinkTo(exploreUrl, filters)} />
            <ActionMenu>
              <MenuItem
                className="action-icon-menu-item"
                id="topic-summary-top-stories-download"
                primaryText={formatMessage(localMessages.downloadNoFBData)}
                rightIcon={<DownloadButton />}
                onTouchTap={this.downloadCsvNoFBData}
              />
              <MenuItem
                className="action-icon-menu-item"
                id="topic-summary-top-stories-download-with-facebook"
                primaryText={formatMessage(localMessages.downloadWithFBData)}
                rightIcon={<DownloadButton />}
                onTouchTap={this.downloadCsvWithFBData}
              />
            </ActionMenu>
          </div>
        </Permissioned>
        <h2>
          <LinkWithFilters to={`/topics/${topicId}/stories`}>
            <FormattedMessage {...localMessages.title} />
          </LinkWithFilters>
        </h2>
        <TopicStoryTable
          stories={stories}
          showTweetCounts={showTweetCounts}
          topicId={topicId}
          onChangeSort={isLoggedIn ? this.onChangeSort : null}
          onChangeFocusSelection={handleFocusSelected}
          sortedBy={sort}
          maxTitleLength={50}
        />
      </DataCard>
    );
  }
}

StoriesSummaryContainer.propTypes = {
  // from the composition chain
  intl: PropTypes.object.isRequired,
  // from parent
  topicId: PropTypes.number.isRequired,
  filters: PropTypes.object.isRequired,
  location: PropTypes.object.isRequired,
  // from dispatch
  fetchData: PropTypes.func.isRequired,
  handleFocusSelected: PropTypes.func.isRequired,
  sortData: PropTypes.func.isRequired,
  // from state
  fetchStatus: PropTypes.string.isRequired,
  sort: PropTypes.string.isRequired,
  stories: PropTypes.array,
  user: PropTypes.object,
  showTweetCounts: PropTypes.bool,
  addAppNotice: PropTypes.func,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.summary.topStories.fetchStatus,
  sort: state.topics.selected.summary.topStories.sort,
  stories: state.topics.selected.summary.topStories.stories,
  user: state.user,
  showTweetCounts: Boolean(state.topics.selected.info.ch_monitor_id),
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  fetchData: (props) => {
    const params = {
      ...props.filters,
      sort: props.sort,
      limit: NUM_TO_SHOW,
    };
    dispatch(fetchTopicTopStories(props.topicId, params));
  },
  handleFocusSelected: (focusId) => {
    const params = {
      ...ownProps.filters,
      focusId,
      timespanId: null,
    };
    const newLocation = filteredLocation(ownProps.location, params);
    dispatch(push(newLocation));
    dispatch(filterByFocus(focusId));
  },
  sortData: (sort) => {
    dispatch(sortTopicTopStories(sort));
  },
  addAppNotice: () => {
    let htmlMessage = ownProps.intl.formatMessage(messages.currentlyDownloadingCsv);
    htmlMessage = `${htmlMessage} <a href="${HELP_STORIES_CSV_COLUMNS}">${ownProps.intl.formatHTMLMessage(messages.learnMoreAboutColumnsCsv)}</a>`;
    dispatch(addNotice({ level: LEVEL_INFO, htmlMessage }));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    asyncFetch: () => {
      dispatchProps.fetchData({
        topicId: ownProps.topicId,
        filters: ownProps.filters,
        sort: stateProps.sort,
      });
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeDescribedDataCard(localMessages.descriptionIntro, messages.storiesTableHelpText)(
        composeAsyncContainer(
          StoriesSummaryContainer
        )
      )
    )
  );
