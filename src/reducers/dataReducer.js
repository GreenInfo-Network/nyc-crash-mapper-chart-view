import { ENTITY_DATA_REQUEST, ENTITY_DATA_SUCCESS, ENTITY_DATA_ERROR } from '../common/actionTypes';

const defaultState = {
  errorCharts: null, // any error from the charts data request
  isFetchingCharts: false, // is the app waiting on a chart data request?
  borough: {}, // hash to store borough data
  city_council: {}, // ... city council district data
  citywide: {}, // ... citywide data
  community_board: {}, // ... community board data
  nta: {}, // ... neighborhood (tabulation area) data
  nypd: {}, // ... nypd precinct data
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ENTITY_DATA_REQUEST:
      return {
        ...state,
        isFetchingCharts: true,
      };

    case ENTITY_DATA_SUCCESS:
      return {
        ...state,
        isFetchingCharts: false,
        [action.geo]: {
          ...state[action.geo],
          response: action.response, // data unformatted from the API call
        },
      };

    case ENTITY_DATA_ERROR:
      return {
        ...state,
        isFetchingCharts: false,
        errorCharts: action.error,
      };

    default:
      return state;
  }
}
