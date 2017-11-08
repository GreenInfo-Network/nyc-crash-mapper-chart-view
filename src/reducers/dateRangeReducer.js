import { SET_DATE_RANGE_GROUP_ONE, SET_DATE_RANGE_GROUP_TWO } from '../common/actionTypes';
import { parseDate } from '../common/d3Utils';

// TO DO: should these be date strings or date objects?
const defaultState = {
  period1: {
    startDate: parseDate('2016-01'),
    endDate: parseDate('2017-01'),
  },
  period2: {
    startDate: parseDate('2013-01'),
    endDate: parseDate('2014-01'),
  },
};

export default function(state = defaultState, action) {
  switch (action.type) {
    case SET_DATE_RANGE_GROUP_ONE:
      return {
        ...state,
        period1: {
          startDate: action.dates[1],
          endDate: action.dates[0],
        },
      };

    case SET_DATE_RANGE_GROUP_TWO:
      return {
        ...state,
        period2: {
          startDate: action.dates[1],
          endDate: action.dates[0],
        },
      };

    default:
      return state;
  }
}
