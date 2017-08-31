import {
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  // SELECT_SECONDARY_ENTITY,
  // DESELECT_SECONDARY_ENTITY,
} from '../common/actionTypes';

const defaultState = {
  byKey: {},
  allKeys: [],
};

function omitEntity(state, action) {
  const { [action.key]: omit, ...rest } = state.councils.byKey;
  return rest;
}

export default function(state = defaultState, action) {
  switch (action.type) {
    case SELECT_PRIMARY_ENTITY:
      return {
        byKey: {
          ...state.councils.byKey,
          [action.council.key]: action.council,
        },
        allKeys: [...state.councils.allKeys, action.council.key],
      };

    case DESELECT_PRIMARY_ENTITY:
      return {
        byKey: omitEntity(state, action),
        allKeys: state.councils.allKeys.filter(key => key !== action.key),
      };

    default:
      return state;
  }
}
