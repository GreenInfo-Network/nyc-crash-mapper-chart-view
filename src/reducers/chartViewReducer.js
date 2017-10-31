import { CHART_VIEW_TOGGLE } from '../common/actionTypes';

export default function(state = 'trend', action) {
  switch (action.type) {
    case CHART_VIEW_TOGGLE:
      return action.view;

    default:
      return state;
  }
}
