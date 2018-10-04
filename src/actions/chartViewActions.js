import { CHART_VIEW_TOGGLE, TREND_AGGREGATION_CHANGED } from '../common/actionTypes';

export const toggleChartView = view => ({
  type: CHART_VIEW_TOGGLE,
  view,
});

export const setTrendAggregation = trendAggMonths => ({
  type: TREND_AGGREGATION_CHANGED,
  trendAggMonths,
});
