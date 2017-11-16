import {
  SET_ENTITY_TYPE,
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  SELECT_SECONDARY_ENTITY,
  DESELECT_SECONDARY_ENTITY,
  REFERENCE_ENTITY_SELECT,
  ENTITIES_SORT_NAME,
  ENTITIES_SORT_RANK,
  ENTITIES_FILTER_NAME,
} from '../common/actionTypes';

import styleVars from '../common/styleVars';

export const entitiesInitalState = {
  primary: {
    color: styleVars['primary-color'],
    key: null,
    values: [],
  },
  secondary: {
    color: styleVars['secondary-color'],
    key: null,
    values: [],
  },
  entityType: 'city_council', // matches properties in store.data
  filterTerm: '',
  reference: 'citywide',
  sortRank: true,
  sortName: false,
  sortAsc: false,
};

export default function(state = entitiesInitalState, action) {
  switch (action.type) {
    case SET_ENTITY_TYPE:
      return {
        ...entitiesInitalState,
        entityType: action.entityType,
      };

    case SELECT_PRIMARY_ENTITY:
      return {
        ...state,
        primary: {
          color: state.primary.color,
          ...action.entity,
        },
      };

    case DESELECT_PRIMARY_ENTITY:
      return {
        ...state,
        primary: {
          color: state.primary.color,
          key: '',
          values: [],
        },
      };

    case SELECT_SECONDARY_ENTITY:
      return {
        ...state,
        secondary: {
          color: state.secondary.color,
          ...action.entity,
        },
      };

    case DESELECT_SECONDARY_ENTITY:
      return {
        ...state,
        secondary: {
          color: state.secondary.color,
          key: action.key,
          values: [],
        },
      };

    case REFERENCE_ENTITY_SELECT:
      return {
        ...state,
        reference: action.key,
      };

    case ENTITIES_SORT_RANK:
      return {
        ...state,
        sortRank: true,
        sortName: false,
        sortAsc: !state.sortAsc,
      };

    case ENTITIES_SORT_NAME:
      return {
        ...state,
        sortRank: false,
        sortName: true,
        sortAsc: !state.sortAsc,
      };

    case ENTITIES_FILTER_NAME:
      return {
        ...state,
        filterTerm: action.term,
      };

    default:
      return state;
  }
}
