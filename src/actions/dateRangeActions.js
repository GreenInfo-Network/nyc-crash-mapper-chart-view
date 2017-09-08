import { SET_DATE_RANGE_GROUP_ONE, SET_DATE_RANGE_GROUP_TWO } from '../common/actionTypes';

export const setDateRangeGroupOne = dates => ({
  type: SET_DATE_RANGE_GROUP_ONE,
  dates,
});

export const setDateRangeGroupTwo = dates => ({
  type: SET_DATE_RANGE_GROUP_TWO,
  dates,
});
