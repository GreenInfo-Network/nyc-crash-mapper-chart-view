// This module contains the code for updating the browser's URL query params
import qs from 'query-string';
import { formatDateYM } from './d3Utils';

/**
  * @function updateQueryParams
  * @param {object} state Redux state object
  * Parses the redux store to update browser history & url query params for stateful URLs
*/
export default function(state) {
  const { dateRanges, chartView, entities, filterType } = state;
  const { customGeography } = state;
  const { trendAggMonths } = state;
  const { period1, period2 } = dateRanges;
  const { entityType, primary, secondary, reference } = entities;
  const { injury, fatality } = filterType;

  // format the part of state we want to save in browser history state
  const historyState = {
    p1start: formatDateYM(period1.startDate),
    p1end: formatDateYM(period1.endDate),
    p2start: formatDateYM(period2.startDate),
    p2end: formatDateYM(period2.endDate),
    primary: primary.key,
    secondary: secondary.key,
    reference,
    geo: entityType,
    cinj: injury.cyclist,
    minj: injury.motorist,
    pinj: injury.pedestrian,
    cfat: fatality.cyclist,
    mfat: fatality.motorist,
    pfat: fatality.pedestrian,
    view: chartView,
    trendAggMonths,
  };

  // only if it exists; it's normal for it not to exist; see customGeographyCeducer
  if (customGeography.length) {
    historyState.lngLats = encodeURIComponent(JSON.stringify(customGeography));
  }

  // stringify the history state so that it can be added to the URL query params
  const stringified = qs.stringify(historyState);

  // update the browser history
  window.history.replaceState(historyState, '', `?${stringified}`);
}
