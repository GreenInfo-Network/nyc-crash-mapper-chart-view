import { ENTITY_DATA_REQUEST, ENTITY_DATA_SUCCESS, ENTITY_DATA_ERROR } from '../common/actionTypes';

const defaultState = {
  error: null,
  isFetching: false,
  borough: {},
  city_council: {},
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
          response: action.response, // data unformatted from the API call
          nested: action.nested, // data nested by identifier id
        },
      };

    case ENTITY_DATA_ERROR:
      return {
        ...state,
        isFetching: false,
        error: action.error,
      };

    default:
      return state;
  }
}
