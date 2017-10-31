// This module contains memoized selector functions that return a computed part of the redux state
// refer to reselect docs for more info: https://github.com/reactjs/reselect
import { createSelector } from 'reselect';

export const entityAllDataSelector = state => state.data;
export const entityTypeSelector = state => state.entities.entityType;

/**
 * Memoized Selector function that returns response & nested data for a given geographic entity
 * @param {object} state: redux state / store
 * @returns {object} part of redux store.data for the current geographic entity
 */
export const entityDataSelector = createSelector(
  entityAllDataSelector,
  entityTypeSelector,
  (allData, entityType) => {
    if (!allData[entityType].response) {
      return { response: [] };
    }
    return allData[entityType];
  }
);

// returns the start and end dates for a time period
export const dateRangesSelector = (state, props) =>
  props.period === 'period1' ? state.dateRanges.period1 : state.dateRanges.period2;

// returns the store.filterType
const filterTypeSelector = state => state.filterType;

/*
 * Memoized Selector that returns mapping to field columns based on active crash filter types
*/
export const filterTypeFieldsSelector = createSelector(filterTypeSelector, filterType => {
  // look up hash that maps each filterType value to a field name in the data
  const lookup = {
    injury: {
      cyclist: 'cyclist_injured',
      motorist: 'motorist_injured',
      pedestrian: 'pedestrian_injured',
    },
    fatality: {
      cyclist: 'cyclist_killed',
      motorist: 'motorist_killed',
      pedestrian: 'pedestrian_killed',
    },
  };

  // array to contain the desired field names from above inner properties
  const fields = [];

  // populate above with desired field names
  Object.keys(filterType).forEach(type => {
    Object.keys(filterType[type]).forEach(subtype => {
      if (filterType[type][subtype]) {
        fields.push(lookup[type][subtype]);
      }
    });
  });

  return fields;
});

// returns the array of objects for a primary entity
const primaryEntityValuesSelector = state => state.entities.primary.values;
// returns the array of objects for a secondary entity
const secondaryEntityValuesSelector = state => state.entities.secondary.values;
// returns array of objects for the reference entity
// reference entity is used for the line chart only and may be either "citywide" or a borough name
const referenceEntityValuesSelector = state => {
  const { entities } = state;
  const { reference } = entities;
  if (reference === 'citywide' && state.data.citywide.response) {
    return state.data.citywide.response;
  }

  if (state.data.borough.response) {
    return state.data.borough.response.filter(d => d.borough.toLowerCase() === reference);
  }

  return [];
};

const entityValuesSelector = entity => {
  if (entity === 'reference') {
    return referenceEntityValuesSelector;
  }

  if (entity === 'primary') {
    return primaryEntityValuesSelector;
  }

  if (entity === 'secondary') {
    return secondaryEntityValuesSelector;
  }

  return () => {};
};

/**
  * Factory function that creates a Memoized Selector that returns a geo entity's values filtered
    by start and end date for a given time period
  * @param {string} entity: type of geographic entity, see accessor functions above
  * @returns {func} Memoized Selector function
*/
const valuesByDateRangeSelector = entity =>
  createSelector(dateRangesSelector, entityValuesSelector(entity), (dates, values) => {
    const { startDate, endDate } = dates;
    return values.filter(d => +d.year_month >= +startDate && +d.year_month <= +endDate);
  });

/**
  * Factory function that returns a Memoized Selector that filters an entity values by crash types and date range
  * @param {string} entity: type of geographic entity to filter for
  * @returns {function}: memoized selector
*/
const valuesFilteredByDateTypeSelector = entity =>
  createSelector(valuesByDateRangeSelector(entity), filterTypeFieldsSelector, (values, fields) =>
    // return an array with computed total of each selected crash type
    values.reduce((acc, cur) => {
      const { year_month } = cur; // need to keep year_month for line charts, or do we?
      const o = {};
      o.count = 0;
      o.year_month = year_month;

      // sum the total of each selected crash type
      // keep only the selected crash types
      Object.keys(cur)
        .filter(key => fields.includes(key))
        .forEach(key => {
          o.count += cur[key];
          o[key] = cur[key];
        });

      acc.push(o);
      return acc;
    }, [])
  );

/**
  * Memoized Selectors that filters an entity values by crash types and date range
  * @param {object} state: redux state / store
  * @param {object} props: react props passed to the component instance
  * @returns {array}: filtered version of store.entities.<entity>.values
*/
export const primaryEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('primary');
export const secondaryEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('secondary');
export const referenceEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('reference');
