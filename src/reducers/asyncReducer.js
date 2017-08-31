import {
  ENTITY_DATA_REQUEST,
  ENTITY_DATA_SUCCESS,
  ENTITY_DATA_ERROR,
} from '../common/actionTypes';

const defaultState = {
  response: [],
  error: null,
  isFetching: false,
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
        response: action.json,
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
