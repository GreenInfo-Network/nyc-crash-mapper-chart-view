import {
  ENTITY_DATA_REQUEST,
  ENTITY_DATA_SUCCESS,
  ENTITY_DATA_ERROR,
  CLEAR_ENTITIES_DATA_CACHE,
} from '../common/actionTypes';

const defaultState = {
  fetchError: null, // any error from the charts data request
  isFetchingData: 0, // is the app waiting on a chart data request?
  borough: {}, // hash to store borough data
  city_council: {}, // ... city council district data
  citywide: {}, // ... citywide data
  community_board: {}, // ... community board data
  neighborhood: {}, // ... neighborhood (tabulation area) data
  assembly: {}, // ... assembly district data
  senate: {}, // ... senate district data
  nypd_precinct: {}, // ... nypd precinct data
  intersection: {}, // ... single street intersection data
  custom: {}, // ... customGeography data
};

export default function(state = defaultState, action) {
  let isFetchingData = state.isFetchingData;

  switch (action.type) {
    case ENTITY_DATA_REQUEST:
      isFetchingData += 1;

      return {
        ...state,
        isFetchingData,
      };

    case ENTITY_DATA_SUCCESS:
      isFetchingData -= 1;

      return {
        ...state,
        isFetchingData,
        [action.geo]: {
          ...state[action.geo],
          response: action.response, // data unformatted from the API call
        },
      };

    case ENTITY_DATA_ERROR:
      return {
        ...state,
        fetchError: action.error,
      };

    case CLEAR_ENTITIES_DATA_CACHE:
      return {
        ...defaultState,
        fetchError: state.fetchError,
        isFetchingData: state.isFetchingData,
      };

    default:
      return state;
  }
}
