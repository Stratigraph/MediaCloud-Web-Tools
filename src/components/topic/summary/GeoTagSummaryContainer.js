import React from 'react';
import { FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import composeAsyncContainer from '../../common/AsyncContainer';
import GeoChart from '../../vis/GeoChart';
import DataCard from '../../common/DataCard';
import { filtersAsUrlParams } from '../../util/location';
import messages from '../../../resources/messages';
import composeDescribedDataCard from '../../common/DescribedDataCard';
import { DownloadButton } from '../../common/IconButton';
import { getBrandLightColor } from '../../../styles/colors';
import { fetchTopicGeocodedStoryCounts } from '../../../actions/topicActions';

const localMessages = {
  title: { id: 'topic.summary.geo.title', defaultMessage: 'Geographic Attention' },
  helpIntro: { id: 'topic.summary.geo.info',
    defaultMessage: 'This is a map of the countries stories within this Topic are about. We\'ve extracted the places mentioned in each story and the ones mentioned most make a story "about" that place. Darker countries have more stories about them.' },
  notEnoughData: { id: 'topic.summary.geo.notEnoughData',
    defaultMessage: 'Sorry, but only {pct} of the stories have been processed to add the places they are about.  We can\'t gaurantee the accuracy of partial results, so we can\'t show a report of the geographic attention right now.  If you are really curious, you can download the CSV using the link in the top-right of this box, but don\'t trust those numbers as fully accurate. Email us if you want us to process this topic to add geographic attention.',
  },
};

const COVERAGE_REQUIRED = 0.8;  // need > this many of the stories tagged to show the results

class GeoTagSummaryContainer extends React.Component {
  downloadCsv = () => {
    const { topicId, filters } = this.props;
    const url = `/api/topics/${topicId}/geo-tags/counts.csv?${filtersAsUrlParams(filters)}`;
    window.location = url;
  }
  render() {
    const { data, coverage } = this.props;
    const { formatMessage, formatNumber } = this.props.intl;
    const coverageRatio = coverage.count / coverage.total;
    let content;
    if (coverageRatio > COVERAGE_REQUIRED) {
      content = (<GeoChart data={data} countryMaxColorScale={getBrandLightColor()} />);
    } else {
      content = (
        <p>
          <FormattedMessage
            {...localMessages.notEnoughData}
            values={{ pct: formatNumber(coverageRatio, { style: 'percent', maximumFractionDigits: 2 }) }}
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
          <FormattedMessage {...localMessages.title} />
        </h2>
        {content}
      </DataCard>
    );
  }

}

GeoTagSummaryContainer.propTypes = {
  // from state
  data: React.PropTypes.array.isRequired,
  coverage: React.PropTypes.object.isRequired,
  fetchStatus: React.PropTypes.string,
  // from dispatch
  asyncFetch: React.PropTypes.func.isRequired,
  // from parent
  topicId: React.PropTypes.number.isRequired,
  filters: React.PropTypes.object.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
};

const mapStateToProps = state => ({
  fetchStatus: state.topics.selected.geotags.fetchStatus,
  data: state.topics.selected.geotags.results,
  coverage: state.topics.selected.geotags.coverage,
});

const mapDispatchToProps = (dispatch, ownProps) => ({
  asyncFetch: () => {
    dispatch(fetchTopicGeocodedStoryCounts(ownProps.topicId, ownProps.filters));
  },
});

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps)(
      composeDescribedDataCard(localMessages.helpIntro, messages.heatMapHelpText)(
        composeAsyncContainer(
          GeoTagSummaryContainer
        )
      )
    )
  );