import { CHART_VIEW_TOGGLE, TREND_AGGREGATION_CHANGED } from '../common/actionTypes';

export const toggleChartView = view => ({
  type: CHART_VIEW_TOGGLE,
  view,
});

export const setTrendAggregation = aggmonths => ({
  type: TREND_AGGREGATION_CHANGED,
  aggmonths,
});
