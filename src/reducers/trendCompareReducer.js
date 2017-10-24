import { TREND_COMPARE_TOGGLE } from '../common/actionTypes';

const defaultState = {
  trend: false,
  compare: true,
};

export default (state = defaultState, action) => {
  switch (action.type) {
    case TREND_COMPARE_TOGGLE:
      return {
        trend: !state.trend,
        compare: !state.compare,
      };

    default:
      return state;
  }
};
