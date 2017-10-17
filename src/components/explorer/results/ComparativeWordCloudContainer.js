import PropTypes from 'prop-types';
import React from 'react';
import { FormattedHTMLMessage, FormattedMessage, injectIntl } from 'react-intl';
import { connect } from 'react-redux';
import { Grid, Row, Col } from 'react-flexbox-grid/lib';
import composeAsyncContainer from '../../common/AsyncContainer';
import DataCard from '../../common/DataCard';
import { fetchQueryTopWords, fetchDemoQueryTopWords, selectComparativeWordField } from '../../../actions/explorerActions';
// import { generateParamStr } from '../../../lib/apiUtil';
import { queryPropertyHasChanged } from '../../../lib/explorerUtil';
import { getBrandDarkColor } from '../../../styles/colors';
import ComparativeOrderedWordCloud from '../../vis/ComparativeOrderedWordCloud';
import OrderedWordCloud from '../../vis/OrderedWordCloud';
import WordSelectWrapper from './WordSelectWrapper';

const localMessages = {
  title: { id: 'explorer.comparativeWords.title', defaultMessage: 'Comparative Words' },
  intro: { id: 'explorer.comparativeWords.intro', defaultMessage: ' These words are the most used in each query. They are sized according to total count across all words in ...' },
  leftTitleMsg: { id: 'explorer.comparativeWords.left', defaultMessage: 'Words Matching {name}' },
  centerTitleMsg: { id: 'explorer.comparativeWords.center', defaultMessage: 'Comparison between {leftName} and {rightName}' },
  rightTitleMsg: { id: 'explorer.comparativeWords.right', defaultMessage: 'Words Matching {name}' },

};
const LEFT = 0;
const RIGHT = 1;

class ComparativeWordCloudContainer extends React.Component {
  componentWillMount() {
    const { queries, leftQuery, selectComparativeWords } = this.props;
    if (leftQuery === null) { // selections haven't been set yet so do init
      const leftQ = queries[0];
      const rightQ = queries.length > 1 ? queries[1] : queries[0];
      selectComparativeWords(leftQ, LEFT);
      selectComparativeWords(rightQ, RIGHT);
    }
  }
  componentWillReceiveProps(nextProps) {
    const { lastSearchTime, fetchData, leftQuery, rightQuery } = this.props;
    if (nextProps.lastSearchTime !== lastSearchTime) {
      fetchData([leftQuery, rightQuery]);
    }
  }
  shouldComponentUpdate(nextProps) {
    const { results, queries, leftQuery, rightQuery } = this.props;
    // only re-render if results, any labels, or any colors have changed
    if (results.length) { // may have reset results so avoid test if results is empty
      const labelsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'label');
      const colorsHaveChanged = queryPropertyHasChanged(queries.slice(0, results.length), nextProps.queries.slice(0, results.length), 'color');
      return (
        ((labelsHaveChanged || colorsHaveChanged))
         || (results !== nextProps.results)
         || (nextProps.leftQuery !== leftQuery
         || nextProps.rightQuery !== rightQuery)
      );
    }
    return false; // if both results and queries are empty, don't update
  }

  componentWillUnmount() {
    this.setState({ leftQuery: '', rightQuery: '' });
  }

  selectAndFetchComparedQueries = (queryObj, target) => {
    const { fetchData, leftQuery, rightQuery, selectComparativeWords } = this.props;
    selectComparativeWords(queryObj, target);
    if (target === LEFT) {
      fetchData([queryObj, rightQuery]);
    } else {
      fetchData([leftQuery, queryObj]);
    }
  }

  downloadCsv = (query) => {
    let url = null;
    if (parseInt(query.searchId, 10) >= 0) {
      url = `/api/explorer/sentences/count.csv/${query.searchId}/${query.index}`;
    } else {
      url = `/api/explorer/sentences/count.csv/[{"q":"${query.q}"}]/${query.index}`;
    }
    window.location = url;
  }

  render() {
    const { queries, results, handleWordCloudClick, leftQuery, rightQuery } = this.props;
    // test the results before we pass to cowc, are there two valid sets of arrays
    // const mergedResultsWithQueryInfo = results.map((r, idx) => Object.assign({}, r, queries[idx]));
    if (results && results.length === 1) {
      return (
        <Grid>
          <h2><FormattedMessage {...localMessages.title} /></h2>
          <Row>
            <Col lg={12}>
              <DataCard>
                <OrderedWordCloud
                  words={results[0]}
                  // alreadyNormalized
                  width={390}
                />
              </DataCard>
            </Col>
          </Row>
        </Grid>
      );
    } else if (results && results.length > 0 && leftQuery !== null) {
      return (
        <DataCard>
          <Grid>
            <Row>
              <h2><FormattedMessage {...localMessages.title} /></h2>
            </Row>
            <Row>
              <WordSelectWrapper queries={queries} selectComparativeWords={this.selectAndFetchComparedQueries} leftQuery={leftQuery} rightQuery={rightQuery} />
            </Row>
            <Row>
              <ComparativeOrderedWordCloud
                leftWords={results[0]}
                rightWords={results[1]}
                leftTextColor={leftQuery.color}
                rightTextColor={rightQuery.color}
                textColor={getBrandDarkColor()}
                onWordClick={handleWordCloudClick}
                leftTitleMsg={<FormattedHTMLMessage {...localMessages.leftTitleMsg} values={{ name: leftQuery.label }} />}
                centerTitleMsg={<FormattedHTMLMessage {...localMessages.centerTitleMsg} values={{ leftName: leftQuery.label, rightName: rightQuery.label }} />}
                rightTitleMsg={<FormattedHTMLMessage {...localMessages.rightTitleMsg} values={{ name: rightQuery.label }} />}
              />
            </Row>
          </Grid>
        </DataCard>
      );
    }
    return <div>Error</div>;
  }

}

ComparativeWordCloudContainer.propTypes = {
  lastSearchTime: React.PropTypes.number.isRequired,
  queries: React.PropTypes.array.isRequired,
  // from composition
  intl: React.PropTypes.object.isRequired,
  // from dispatch
  fetchData: React.PropTypes.func.isRequired,
  results: React.PropTypes.array.isRequired,
  // from mergeProps
  asyncFetch: React.PropTypes.func.isRequired,
  // from state
  fetchStatus: React.PropTypes.string.isRequired,
  handleWordCloudClick: PropTypes.func.isRequired,
  selectComparativeWords: PropTypes.func.isRequired,
  leftQuery: React.PropTypes.object,
  rightQuery: React.PropTypes.object,
};

const mapStateToProps = state => ({
  lastSearchTime: state.explorer.lastSearchTime.time,
  user: state.user,
  fetchStatus: state.explorer.topWords.fetchStatus,
  results: state.explorer.topWords.list,
  leftQuery: state.explorer.topWords.left,
  rightQuery: state.explorer.topWords.right,
});

const mapDispatchToProps = (dispatch, state) => ({
  selectComparativeWords: (query, target) => {
    dispatch(selectComparativeWordField({ query, target }));
  },
  fetchData: (queries) => {
    // this should trigger when the user clicks the Search button or changes the URL
    // for n queries, run the dispatch with each parsed query
    // dispatch(resetTopWords()); // necessary if a query deletion has occurred
    if (state.user.isLoggedIn) {
      const runTheseQueries = queries || state.queries;
      const comparedQueries = runTheseQueries.map(q => ({
        start_date: q.startDate || q.start_date,
        end_date: q.endDate || q.start_date,
        q: q.q,
        index: q.index,
        sources: q.sources.map(s => s.id || s.media_id),
        collections: q.collections.map(c => c.id || c.tags_id),
      }));
      return dispatch(fetchQueryTopWords(comparedQueries[0], comparedQueries[1]));
    }
    const runTheseQueries = queries || state.queries;
    const comparedQueries = runTheseQueries.map(q => ({
      index: q.index, // should be same as q.index btw
      search_id: q.searchId, // may or may not have these
      query_id: q.id, // could be undefined
      q: q.q, // only if no query id, means demo user added a keyword
    }));
    return dispatch(fetchDemoQueryTopWords(comparedQueries[0], comparedQueries[1]));
  },
});

function mergeProps(stateProps, dispatchProps, ownProps) {
  return Object.assign({}, stateProps, dispatchProps, ownProps, {
    handleWordCloudClick: () => {
      // const params = generateParamStr({ ...stateProps.filters, stem: word.stem, term: word.term });
      // add chosen word to query
      // which word was clicked, from where, add to that query.q and into the url
      // dispatch update query
      // then
      // dispatchProps.goToUrl(url);
    },
    asyncFetch: () => {
      if (ownProps.queries && ownProps.queries.length > 0) {
        if (ownProps.queries.length > 1) {
          dispatchProps.fetchData([ownProps.queries[0], ownProps.queries[1]]);
        } else {
          dispatchProps.fetchData([ownProps.queries[0]]);
        }
      }
    },
  });
}

export default
  injectIntl(
    connect(mapStateToProps, mapDispatchToProps, mergeProps)(
      composeAsyncContainer(
        ComparativeWordCloudContainer
      )
    )
  );
