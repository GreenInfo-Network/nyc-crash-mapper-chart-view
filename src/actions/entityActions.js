import {
  SET_ENTITY_TYPE,
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  SELECT_SECONDARY_ENTITY,
  DESELECT_SECONDARY_ENTITY,
} from '../common/actionTypes';

export const setEntityType = entityType => ({
  type: SET_ENTITY_TYPE,
  entityType,
});

// action creators for selecting and deselecting a primary and secondary geographic entity
// TO DO: abstract these into just two action creators?
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
