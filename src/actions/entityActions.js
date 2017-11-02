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

// set the geography type
export const setEntityType = entityType => ({
  type: SET_ENTITY_TYPE,
  entityType,
});

// action creators for selecting and deselecting a primary and secondary geographic entity
// TO DO: abstract these into just two action creators?
// @param {object} entity Represents an object from the Redux `store.data.nested` array with maxes, totals, key, & values array
export const selectPrimaryEntity = entity => ({
  type: SELECT_PRIMARY_ENTITY,
  entity,
});

export const deselectPrimaryEntity = () => ({
  type: DESELECT_PRIMARY_ENTITY,
});

export const selectSecondaryEntity = entity => ({
  type: SELECT_SECONDARY_ENTITY,
  entity,
});

export const deselectSecondaryEntity = () => ({
  type: DESELECT_SECONDARY_ENTITY,
});

export const setReferenceEntity = key => ({
  type: REFERENCE_ENTITY_SELECT,
  key,
});

export const sortEntitiesByName = () => ({
  type: ENTITIES_SORT_NAME,
});

export const sortEntitiesByRank = () => ({
  type: ENTITIES_SORT_RANK,
});

export const filterEntitiesByName = term => ({
  type: ENTITIES_FILTER_NAME,
  term,
});
