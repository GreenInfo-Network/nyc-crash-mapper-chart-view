import {
  CLEAR_CUSTOM_GEOGRAPHY,
  CHANGE_CUSTOM_GEOGRAPHY,
} from '../common/actionTypes';

export const clearCustomGeography = () => ({
  type: CLEAR_CUSTOM_GEOGRAPHY,
});

export const changeCustomGeography = () => ({
  type: CHANGE_CUSTOM_GEOGRAPHY,
});
