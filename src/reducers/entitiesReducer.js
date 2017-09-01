import {
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  SELECT_SECONDARY_ENTITY,
  DESELECT_SECONDARY_ENTITY,
} from '../common/actionTypes';

const defaultState = {
  primary: {
    key: '',
    values: [],
  },
  secondary: {
    key: '',
    values: [],
  },
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case SELECT_PRIMARY_ENTITY:
      return {
        ...state,
        primary: {
          key: action.key,
          values: action.values,
        },
      };

    case DESELECT_PRIMARY_ENTITY:
      return {
        ...state,
        primary: {
          key: '',
          values: [],
        },
      };

    case SELECT_SECONDARY_ENTITY:
      return {
        ...state,
        secondary: {
          key: action.key,
          values: action.values,
        },
      };

    case DESELECT_SECONDARY_ENTITY:
      return {
        ...state,
        secondary: {
          key: action.key,
          values: [],
        },
      };

    default:
      return state;
  }
}
