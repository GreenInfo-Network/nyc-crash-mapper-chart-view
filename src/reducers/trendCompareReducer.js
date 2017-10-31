import { TREND_COMPARE_TOGGLE } from '../common/actionTypes';

export default (state = 'trend', action) => {
  switch (action.type) {
    case TREND_COMPARE_TOGGLE:
      return action.view;

    default:
      return state;
  }
};
