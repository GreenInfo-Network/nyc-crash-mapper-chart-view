import { CHART_VIEW_TOGGLE } from '../common/actionTypes';

const toggleChartView = view => ({
  type: CHART_VIEW_TOGGLE,
  view,
});

export default toggleChartView;
