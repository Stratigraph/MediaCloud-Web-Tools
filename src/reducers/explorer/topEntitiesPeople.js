import { createIndexedAsyncReducer } from '../../lib/reduxHelpers';
import { FETCH_TOP_ENTITIES_PEOPLE, RESET_ENTITIES_PEOPLE } from '../../actions/explorerActions';
import * as fetchConstants from '../../lib/fetchConstants';

const topEntitiesPeople = createIndexedAsyncReducer({
  initialState: ({
    fetchStatus: '', fetchStatuses: [], results: [],
  }),
  action: FETCH_TOP_ENTITIES_PEOPLE,
  [RESET_ENTITIES_PEOPLE]: () => ({
    fetchStatus: fetchConstants.FETCH_INVALID, fetchStatuses: [], results: [],
  }),
});
export default topEntitiesPeople;
