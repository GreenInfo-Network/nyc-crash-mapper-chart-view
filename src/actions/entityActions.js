import {
  SELECT_PRIMARY_ENTITY,
  DESELECT_PRIMARY_ENTITY,
  SELECT_SECONDARY_ENTITY,
  DESELECT_SECONDARY_ENTITY,
} from '../common/actionTypes';

// action creators for selecting and deselecting a primary and secondary geographic entity
// TO DO: abstract these into just two action creators?
export const selectPrimaryEntity = (key, values) => ({
  type: SELECT_PRIMARY_ENTITY,
  key,
  values,
});

export const deselectPrimaryEntity = () => ({
  type: DESELECT_PRIMARY_ENTITY,
});

export const selectSecondaryEntity = (key, values) => ({
  type: SELECT_SECONDARY_ENTITY,
  key,
  values,
});

export const deselectSecondaryEntity = () => ({
  type: DESELECT_SECONDARY_ENTITY,
});
