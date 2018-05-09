import { combineReducers } from 'redux';
import matchingStories from './matchingStories';
import matchingAttention from './matchingAttention';
import matchingStoryCounts from './matchingStoryCounts';
import retweetCoverage from './retweetCoverage';
import retweetStoryCounts from './retweetStoryCounts';
import topCountriesCoverage from './topCountriesCoverage';
import topCountriesStoryCounts from './topCountriesStoryCounts';
import nytThemeCoverage from './nytThemeCoverage';
import nytThemeStoryCounts from './nytThemeStoryCounts';
import mediaTypeCoverage from './mediaTypeCoverage';
import mediaTypeStoryCounts from './mediaTypeStoryCounts';
import workflow from './workflow';
import matchingStoriesConfigWorkflow from './matchingStoriesConfigWorkflow';
import matchingStoriesProbableWords from './matchingStoriesProbableWords';
import matchingStoriesSample from './matchingStoriesSample';

const createFocusReducer = combineReducers({
  matchingStories,
  matchingAttention,
  matchingStoryCounts,
  retweetCoverage,
  retweetStoryCounts,
  topCountriesCoverage,
  topCountriesStoryCounts,
  nytThemeCoverage,
  nytThemeStoryCounts,
  mediaTypeCoverage,
  mediaTypeStoryCounts,
  workflow,
  matchingStoriesConfigWorkflow,
  matchingStoriesProbableWords,
  matchingStoriesSample,
});

export default createFocusReducer;
