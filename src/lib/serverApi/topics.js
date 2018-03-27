import { createApiPromise, createPostingApiPromise, acceptParams } from '../apiUtil';

export function topicsList(linkId) {
  return createApiPromise('/api/topics/listFilterCascade', linkId ? { linkId } : undefined);
}

export function topicsPublicList() {
  return createApiPromise('/api/topics/list');
}

export function topicsAdminList() {
  return createApiPromise('/api/topics/admin/list');
}

export function topicSummary(topicId) {
  return createApiPromise(`/api/topics/${topicId}/summary`);
}

export function topicTopStories(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'sort', 'limit', 'q', 'linkId']);
  return createApiPromise(`/api/topics/${topicId}/stories`, acceptedParams);
}

export function topicTopMedia(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'sort', 'limit', 'linkId']);
  return createApiPromise(`/api/topics/${topicId}/media`, acceptedParams);
}

export function topicTopWords(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'withTotals']);
  return createApiPromise(`/api/topics/${topicId}/words`, acceptedParams);
}

export function topicSnapshotsList(topicId) {
  return createApiPromise(`/api/topics/${topicId}/snapshots/list`);
}

export function topicTimespansList(topicId, snapshotId, params) {
  const acceptedParams = acceptParams(params, ['focusId']);
  return createApiPromise(`/api/topics/${topicId}/snapshots/${snapshotId}/timespans/list`, acceptedParams);
}

export function topicSentenceCounts(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/sentences/count`, acceptedParams);
}

export function story(topicId, storiesId) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}`);
}

export function storyUpdate(storiesId, params) {
  const acceptedParams = acceptParams(params, ['id', 'title', 'url', 'guid', 'language', 'description', 'publish_date', 'confirm_date', 'undateable']);
  return createPostingApiPromise(`/api/stories/${storiesId}/storyUpdate`, acceptedParams);
}

export function storyWords(topicId, storiesId) {
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/words`);
}

export function storyInlinks(topicId, storiesId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/inlinks`, acceptedParams);
}

export function storyOutlinks(topicId, storiesId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/stories/${storiesId}/outlinks`, acceptedParams);
}

export function media(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}`, acceptedParams);
}

export function mediaSentenceCounts(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/sentences/count`, acceptedParams);
}

export function mediaStories(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'sort', 'limit']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/stories`, acceptedParams);
}

export function mediaInlinks(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'sort', 'limit']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/inlinks`, acceptedParams);
}

export function mediaOutlinks(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'sort', 'limit']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/outlinks`, acceptedParams);
}

export function mediaWords(topicId, mediaId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/media/${mediaId}/words`, acceptedParams);
}

export function topicFocalSetsList(topicId, snapshotId) {
  return createApiPromise(`/api/topics/${topicId}/focal-sets/list`, { snapshotId });
}

export function listFocalSetDefinitions(topicId) {
  return createApiPromise(`api/topics/${topicId}/focal-set-definitions/list`);
}

export function updateOrCreateFocusDefinition(topicId, params) {
  const acceptedParams = acceptParams(params, [
    'foci_id',
    'focalSetName', 'focalSetDescription', 'focalTechnique',
    'focusName', 'focusDescription', 'focalSetDefinitionId', 'keywords',
  ]);
  return createPostingApiPromise(`/api/topics/${topicId}/focus-definitions/update-or-create`, acceptedParams);
}

export function deleteFocalSetDefinition(topicId, focalSetDefinitionId) {
  return createApiPromise(`/api/topics/${topicId}/focal-set-definitions/${focalSetDefinitionId}/delete`, null, 'delete');
}

export function deleteFocusDefinition(topicId, focusDefinitionId) {
  return createApiPromise(`/api/topics/${topicId}/focus-definitions/${focusDefinitionId}/delete`, null, 'delete');
}

export function topicGenerateSnapshot(topicId, params) {
  const acceptedParams = acceptParams(params, ['note']);
  return createPostingApiPromise(`/api/topics/${topicId}/snapshots/generate`, acceptedParams);
}

export function topicUpdatePermission(topicId, email, permission) {
  return createPostingApiPromise(`/api/topics/${topicId}/permissions/update`, { email, permission }, 'put');
}

export function topicListPermissions(topicId) {
  return createApiPromise(`/api/topics/${topicId}/permissions/list`);
}

export function topicSetFavorite(topicId, favorite) {
  return createPostingApiPromise(`/api/topics/${topicId}/favorite`, { favorite: (favorite) ? 1 : 0 }, 'put');
}

export function favoriteTopics() {
  return createApiPromise('/api/topics/favorite');
}

export function topicStoryCounts(topicId, params) {
  // important to include snapshot id here, so the server can use it
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/stories/counts`, acceptedParams);
}

export function topicEnglishStoryCounts(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/stories/english-counts`, acceptedParams);
}

export function topicUndateableStoryCounts(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/stories/undateable-counts`, acceptedParams);
}

export function topicFocalSetSentenceCounts(topicId, focalSetId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'focusId', 'timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/sentences/focal-set/${focalSetId}/count`, acceptedParams);
}

export function word(topicId, wordstem) {
  return createApiPromise(`/api/topics/${topicId}/words/${wordstem}`);
}

export function wordSentenceCounts(topicId, wordstem, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/words/${wordstem}*/sentences/count`, acceptedParams);
}

export function wordStories(topicId, wordstem, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q', 'sort', 'limit']);
  return createApiPromise(`/api/topics/${topicId}/words/${wordstem}*/stories`, acceptedParams);
}

export function wordWords(topicId, wordstem, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/words/${wordstem}*/words`, acceptedParams);
}

export function wordSampleSentences(topicId, wordstem, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/words/${wordstem}*/sample-usage`, acceptedParams);
}

/*
export function wordMedia(topicId, word, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/words/${word}/media`, acceptedParams);
}
*/

export function createTopic(params) {
  const acceptedParams = acceptParams(params, ['name', 'description', 'solr_seed_query', 'is_public', 'max_stories', 'max_iterations',
    'ch_monitor_id', 'start_date', 'end_date', 'spidered', 'sources[]', 'collections[]', 'is_logogram']);
  return createPostingApiPromise('/api/topics/create', acceptedParams, 'put');
}

export function resetTopic(topicId) {
  return createPostingApiPromise(`/api/topics/${topicId}/reset`);
}

export function fetchStoryCountByQuery(params) {
  const acceptedParams = acceptParams(params, ['q', 'start_date', 'end_date', 'sources[]', 'collections[]']);
  return createPostingApiPromise('/api/topics/create/preview/story/count', acceptedParams);
}

export function fetchAttentionByQuery(params) {
  const acceptedParams = acceptParams(params, ['q', 'start_date', 'end_date', 'sources[]', 'collections[]']);
  return createPostingApiPromise('/api/topics/create/preview/sentences/count', acceptedParams);
}

export function fetchStorySampleByQuery(params) {
  const acceptedParams = acceptParams(params, ['q', 'start_date', 'end_date', 'sources[]', 'collections[]']);
  return createPostingApiPromise('/api/topics/create/preview/stories/sample', acceptedParams);
}

export function fetchWordsByQuery(params) {
  const acceptedParams = acceptParams(params, ['q', 'start_date', 'end_date', 'sources[]', 'collections[]']);
  return createPostingApiPromise('/api/topics/create/preview/words/count', acceptedParams);
}

export function updateTopic(topicId, params) {
  const acceptedParams = acceptParams(params, ['name', 'description', 'solr_seed_query', 'is_public', 'max_stories', 'max_iterations',
    'ch_monitor_id', 'start_date', 'end_date', 'spidered', 'sources[]', 'collections[]', 'is_logogram']);
  return createPostingApiPromise(`/api/topics/${topicId}/update`, acceptedParams, 'put');
}

export function topicMapFiles(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/map-files`, acceptedParams);
}

export function fetchCustomMap(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'color_field', 'num_media', 'include_weights', 'num_links_per_medium']);
  return createApiPromise(`/api/topics/${topicId}/map-files/fetchCustomMap`, acceptedParams);
}

export function fetchTopicSearchResults(searchStr) {
  return createApiPromise('/api/topics/search', { searchStr });
}

export function fetchTopicWithNameExists(searchStr, topicId) {
  return createApiPromise('/api/topics/name-exists', { searchStr, topicId });
}

export function topicNytTaggedStoryCoverage(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/nyt-tags/coverage`, acceptedParams);
}

export function topicNytTaggedStoryCounts(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/nyt-tags/counts`, acceptedParams);
}

export function topicGeocodedStoryCoverage(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/geo-tags/coverage`, acceptedParams);
}

export function topicGeocodedStoryCounts(topicId, params) {
  const acceptedParams = acceptParams(params, ['timespanId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/geo-tags/counts`, acceptedParams);
}

export function topicSpider(topicId) {
  return createPostingApiPromise(`/api/topics/${topicId}/spider`);
}

export function userQueuedAndRunningTopics() {
  return createApiPromise('/api/topics/queued-and-running');
}

export function topicPreviewRetweetPartisanshipStoryCounts(topicId) {
  return createApiPromise(`/api/topics/${topicId}/focal-sets/retweet-partisanship/preview/story-counts`);
}

export function topicPreviewRetweetPartisanshipCoverage(topicId) {
  return createApiPromise(`/api/topics/${topicId}/focal-sets/retweet-partisanship/preview/coverage`);
}

export function createRetweetFocalSet(topicId, params) {
  const acceptedParams = acceptParams(params, ['focalSetName', 'focalSetDescription']);
  return createPostingApiPromise(`/api/topics/${topicId}/focal-sets/retweet-partisanship/create`, acceptedParams);
}

export function topicPreviewTopCountriesStoryCounts(topicId, numCountries) {
  const acceptedParams = acceptParams(numCountries, ['numCountries']);
  return createApiPromise(`/api/topics/${topicId}/focal-sets/top-countries/preview/story-counts`, acceptedParams);
}

export function topicPreviewTopCountriesCoverage(topicId, numCountries) {
  const acceptedParams = acceptParams(numCountries, ['numCountries']);
  return createApiPromise(`/api/topics/${topicId}/focal-sets/top-countries/preview/coverage`, acceptedParams);
}

export function topicPreviewNytThemeStoryCounts(topicId, numThemes) {
  const acceptedParams = acceptParams(numThemes, ['numThemes']);
  return createApiPromise(`/api/topics/${topicId}/focal-sets/nyt-theme/preview/story-counts`, acceptedParams);
}

export function topicPreviewNytThemeCoverage(topicId, numThemes) {
  const acceptedParams = acceptParams(numThemes, ['numThemes']);
  return createApiPromise(`/api/topics/${topicId}/focal-sets/nyt-theme/preview/coverage`, acceptedParams);
}

export function topicPreviewMediaTypeStoryCounts(topicId) {
  return createApiPromise(`/api/topics/${topicId}/focal-sets/media-type/preview/story-counts`);
}

export function topicPreviewMediaTypeCoverage(topicId) {
  return createApiPromise(`/api/topics/${topicId}/focal-sets/media-type/preview/coverage`);
}

export function createTopCountriesFocalSet(topicId, params) {
  const acceptedParams = acceptParams(params, ['focalSetName', 'focalSetDescription', 'data']);
  acceptedParams['data[]'] = JSON.stringify(acceptedParams.data);
  return createPostingApiPromise(`/api/topics/${topicId}/focal-sets/top-countries/create`, acceptedParams);
}

export function createNytThemeFocalSet(topicId, params) {
  const acceptedParams = acceptParams(params, ['focalSetName', 'focalSetDescription', 'data']);
  acceptedParams['data[]'] = JSON.stringify(acceptedParams.data);
  return createPostingApiPromise(`/api/topics/${topicId}/focal-sets/nyt-theme/create`, acceptedParams);
}

export function createMediaTypeFocalSet(topicId, params) {
  const acceptedParams = acceptParams(params, ['focalSetName', 'focalSetDescription']);
  return createPostingApiPromise(`/api/topics/${topicId}/focal-sets/media-type/create`, acceptedParams);
}

export function topicWord2Vec(topicId) {
  return createApiPromise(`/api/topics/${topicId}/word2vec`);
}

export function topicWord2VecTimespans(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'focusId', 'q']);
  return createApiPromise(`/api/topics/${topicId}/word2vec-timespans`, acceptedParams);
}

export function topicTopPeople(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'sort', 'limit', 'q', 'linkId']);
  return createApiPromise(`/api/topics/${topicId}/entities/people`, acceptedParams);
}

export function topicTopOrgs(topicId, params) {
  const acceptedParams = acceptParams(params, ['snapshotId', 'timespanId', 'focusId', 'sort', 'limit', 'q', 'linkId']);
  return createApiPromise(`/api/topics/${topicId}/entities/organizations`, acceptedParams);
}
