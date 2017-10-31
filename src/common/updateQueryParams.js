// This module contains the code for updating the browser's URL query params
import qs from 'query-string';
import { formatDateYM } from './d3Utils';

export default function(state) {
  const { dateRanges, entities, trendCompare, filterType } = state;
  const { period1, period2 } = dateRanges;
  const { entityType, primary, secondary } = entities;
  const { injury, fatality } = filterType;

  const stringified = qs.stringify({
    p1start: formatDateYM(period1.startDate),
    p1end: formatDateYM(period1.endDate),
    p2start: formatDateYM(period2.startDate),
    p2end: formatDateYM(period2.endDate),
    primary: primary.key,
    secondary: secondary.key,
    geo: entityType,
    cinj: injury.cyclist,
    minj: injury.motorist,
    pinj: injury.pedestrian,
    cfat: fatality.cyclist,
    mfat: fatality.motorist,
    pfat: fatality.pedestrian,
    view: trendCompare.trend ? 'trend' : 'compare',
  });

  const url = window.location.origin;
  window.history.replaceState('', '', `${url}?${stringified}`);
}
