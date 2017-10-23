// This module contains memoized selector functions that return a computed part of the redux state
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

// returns the store.filterType
const filterTypeSelector = state => state.filterType;

// returns the array of objects for a primary entity
const primaryEntityValuesSelector = state => state.entities.primary.values;
// returns the array of objects for a secondary entity
const secondaryEntityValuesSelector = state => state.entities.secondary.values;
// returns array of objects for the reference entity
const referenceEntityValuesSelector = state => {
  const { reference } = state.entities;
  if (reference === 'Citywide') {
    return state.data.citywide.response;
  }
  return state.data.borough.response.filter(d => d.borough === reference);
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
  createSelector(filterTypeSelector, valuesByDateRangeSelector(entity), (filterType, values) => {
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

    // array to contain the desired field names from above
    const fields = [];

    // populate above with desired field names
    Object.keys(filterType).forEach(type => {
      Object.keys(filterType[type]).forEach(subtype => {
        if (filterType[type][subtype]) {
          fields.push(lookup[type][subtype]);
        }
      });
    });

    // return an array with computed total of each selected crash type
    return values.reduce((acc, cur) => {
      const o = { ...cur }; // need to keep "year_month" and "<entity_type>" properties
      o.count = 0;

      Object.keys(cur).forEach(key => {
        if (fields.indexOf(key) !== -1) {
          o.count += cur[key];
        }
      });

      acc.push(o);

      return acc;
    }, []);
  });

/**
  * Memoized Selectors that filters an entity values by crash types and date range
  * @param {object} state: redux state / store
  * @param {object} props: react props passed to the component instance
  * @returns {array}: filtered version of store.entities.<entity>.values
*/
export const primaryValuesFilteredSelector = valuesFilteredByDateTypeSelector('primary');
export const secondaryEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('secondary');
export const referenceEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('reference');
