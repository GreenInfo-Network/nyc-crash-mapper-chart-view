// This module contains the logic for the Ranked List Memooized Selector,
// which returns an array of objects satisfying the following criteria
// - one object per geographic identifier (e.g. City Council would mean 51 total objects, Borough would be 5)
// - filtered by the last 3 years of data, starting at previous month to current month (make sure to start on a month that has complete data)
// - filtered by selected crash types (person killed, person injured, etc.)
// - sorted by total injuries, then by total fatalities

import { createSelector } from 'reselect';
import * as d3 from 'd3';
import { entityDataSelector, filterTypeFieldsSelector, entityTypeSelector } from './reduxSelectors';

// memoized selector that returns dates for 1. the previous full month of data and 2. 24 months prior to that
// TIP: per issue 81, this is not 3 years but 2 years
// BUT it would be tedious to change all of these hardcoded "ThreeYears" names, so just be aware
export const lastThreeYearsSelector = createSelector(entityDataSelector, data => {
  const { response } = data;
  const latestDate = response[response.length - 1].year_month;
  const thisMonth = new Date(latestDate);
  thisMonth.setDate(1);
  const threeYearsAgo = new Date(thisMonth);
  threeYearsAgo.setFullYear(threeYearsAgo.getFullYear() - 2);

  return {
    endDate: thisMonth,
    startDate: threeYearsAgo,
  };
});

// memoized selector that filters entity data by last 3 years, using previous month of latest date in dataset
const filterLastThreeYearsSelector = createSelector(
  lastThreeYearsSelector,
  entityDataSelector,
  (dates, data) => {
    const { endDate, startDate } = dates;
    const { response } = data;
    return response.filter(d => d.year_month >= startDate && d.year_month < endDate);
  }
);

// memoized selector that fitlers the last 3 years of data by active crash types
const lastThreeYearsFilteredByType = createSelector(
  filterLastThreeYearsSelector,
  filterTypeFieldsSelector,
  entityTypeSelector,
  (values, fields, entityType) =>
    // return an array with computed total of each selected crash type
    values.reduce((acc, cur) => {
      const { year_month } = cur;
      const o = {};
      o[entityType] = cur[entityType]; // keep the geo identifier
      o.year_month = year_month; // keep year_month for sparkline
      o.total = 0;
      o.totalInjured = 0;
      o.totalKilled = 0;

      // keep only the selected crash types
      // tally up totals for killed & injured
      Object.keys(cur)
        .filter(key => fields.includes(key))
        .forEach(key => {
          const curVal = cur[key];
          o[key] = curVal;
          // total injured + killed
          o.total += curVal;

          // if we have any <person type>_injured fields, add the value to the totalInjured, but exclude the <_byMODE> allocated amounts used in vehicle type views to avoid overcounting
          if ((key.indexOf('injured') > -1) && !(key.indexOf('_by') > -1)) {
            o.totalInjured += curVal;
          }

          // if we have any <person type>_killed fields, add the value to the totalKilled, but exclude the <_byMODE> allocated amounts used in vehicle type views to avoid overcounting
          if ((key.indexOf('killed') > -1) && !(key.indexOf('_by') > -1)) {
            o.totalKilled += curVal;
          }
        });

      acc.push(o);

      return acc;
    }, [])
);

// The "Actual" Ranked List Selector used for the "Rank" chart view
const rankedListSelector = createSelector(
  lastThreeYearsFilteredByType,
  entityTypeSelector,
  (values, entityType) => {
    // nest everything by geographic entity
    const nested = d3
      .nest()
      .key(d => d[entityType])
      .entries(values);

    // sum each entity's totalInjured and totalKilled
    nested.forEach(entity => {
      // if the entity key should be a number, coerce it to one
      entity.key = !isNaN(+entity.key) ? +entity.key : entity.key;
      entity.totalKilled = d3.sum(entity.values, d => d.totalKilled);
      entity.totalInjured = d3.sum(entity.values, d => d.totalInjured);
      entity.maxTotal = d3.max(entity.values, d => d.total);
      entity.sortTotal = entity.totalInjured + entity.totalKilled / 1000;
    });

    // sort by total injured desc then by total killed desc
    nested
      .sort((a, b) => b.totalInjured - a.totalInjured || b.totalKilled - a.totalKilled)
      .forEach((entity, i) => {
        // set "rank" using array index from sorting above
        const prev = nested[i - 1];

        if (prev) {
          if (prev.sortTotal === entity.sortTotal) {
            entity.rank = prev.rank;
          } else {
            entity.rank = prev.rank + 1;
          }
        }

        if (!prev) {
          entity.rank = 1;
        }
      });

    return nested;
  }
);

export default rankedListSelector;
