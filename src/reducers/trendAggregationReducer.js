import { TREND_AGGREGATION_CHANGED } from '../common/actionTypes';

const defaultState = 1; // pretty simple, our state is the number of months

export default function(state = defaultState, action) {
  switch (action.type) {
    case TREND_AGGREGATION_CHANGED:
      return action.aggmonths;
    default:
      return state;
  }
}
