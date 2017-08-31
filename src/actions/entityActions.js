import {
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  SELECT_SECONDARY_ENTITY,
  DESELECT_SECONDARY_ENTITY,
} from '../common/actionTypes';

// action creators for selecting and deselecting a primary and secondary geographic entity
// TO DO: abstract these into just two action creators?
export const selectPrimaryEntity = key => ({
  type: SELECT_PRIMARY_ENTITY,
  key,
});

export const deselectPrimaryEntity = key => ({
  type: DESELECT_PRIMARY_ENTITY,
  key,
});

export const selectSecondaryEntity = key => ({
  type: SELECT_SECONDARY_ENTITY,
  key,
});

export const deselectSecondaryEntity = key => ({
  type: DESELECT_SECONDARY_ENTITY,
  key,
});
