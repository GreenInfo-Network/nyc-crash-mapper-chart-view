// This module contains memoized selectors that return a computed part of the redux state
// refer to reselect docs for more info: https://github.com/reactjs/reselect
import { createSelector } from 'reselect';

const entityAllDataSelector = state => state.data;
const entityTypeSelector = state => state.entities.entityType;

/**
 * Memoized Selector function that returns response & nested data for a given geographic entity
 * @param {object} state: redux state / store
 * @returns {object} part of redux store.data for the current geographic entity
 */
export const entityDataSelector = createSelector(
  entityAllDataSelector,
  entityTypeSelector,
  (allData, entityType) => {
    if (!allData[entityType]) {
      return { response: [], ranked: [] };
    }
    return allData[entityType];
  }
);

// returns the start and end dates for a time period
const dateRangesSelector = (state, props) =>
  props.period === 'period1' ? state.dateRanges.period1 : state.dateRanges.period2;

// returns the array of objects for a geographic entity
const entityValuesSelector = (state, props) =>
  props.entity === 'primary' ? state.entities.primary.values : state.entities.secondary.values;

/**
  * Memoized Selector that returns a geo entity's values filtered by start and end date for a given time period
  * @param {object} state: redux state / store
  * @param {object} props: react props passed to the component instance
  * @returns {object} filtered version of store.entities.<entity>.values
*/
export const valuesByDateRangeSelector = createSelector(
  entityValuesSelector,
  dateRangesSelector,
  (values, dates) => {
    const { startDate, endDate } = dates;
    return values.filter(d => +d.year_month >= +startDate && +d.year_month <= +endDate);
  }
);
