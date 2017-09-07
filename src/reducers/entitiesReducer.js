import {
  SET_ENTITY_TYPE,
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
  entityType: '',
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case SET_ENTITY_TYPE:
      return {
        ...state,
        entityType: action.entityType,
      };

    case SELECT_PRIMARY_ENTITY:
      return {
        ...state,
        primary: {
          ...action.entity,
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
          ...action.entity,
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
