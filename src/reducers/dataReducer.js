import {
  ENTITY_DATA_REQUEST,
  ENTITY_DATA_SUCCESS,
  DATA_FETCH_ERROR,
  RANK_DATA_REQUEST,
  RANK_DATA_SUCCESS,
} from '../common/actionTypes';

const defaultState = {
  error: null,
  isFetching: false,
  borough: {},
  city_council: {},
  citywide: {},
  community_board: {},
  nta: {},
  nypd: {},
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case ENTITY_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case ENTITY_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        [action.geo]: {
          ...state[action.geo],
          response: action.response, // data unformatted from the API call
        },
      };

    case RANK_DATA_REQUEST:
      return {
        ...state,
        isFetching: true,
      };

    case RANK_DATA_SUCCESS:
      return {
        ...state,
        isFetching: false,
        [action.geo]: {
          ...state[action.geo],
          ranked: action.ranked,
        },
      };

    // store an error from any async request that went bad
    case DATA_FETCH_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
}
