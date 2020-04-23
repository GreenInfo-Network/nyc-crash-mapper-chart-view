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
    if (!allData[entityType]) {
      allData[entityType] = {};
    }
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
      cyclist: [
        'cyclist_injured',
        'cyclist_injured_bybike',
        'cyclist_injured_byscooter',
        'cyclist_injured_bymotorcycle',
        'cyclist_injured_bybusvan',
        'cyclist_injured_bycar',
        'cyclist_injured_bysuv',
        'cyclist_injured_bytruck',
        'cyclist_injured_byother',
      ],
      motorist: [
        'motorist_injured',
        'motorist_injured_bybike',
        'motorist_injured_byscooter',
        'motorist_injured_bymotorcycle',
        'motorist_injured_bybusvan',
        'motorist_injured_bycar',
        'motorist_injured_bysuv',
        'motorist_injured_bytruck',
        'motorist_injured_byother',
      ],
      pedestrian: [
        'pedestrian_injured',
        'pedestrian_injured_bybike',
        'pedestrian_injured_byscooter',
        'pedestrian_injured_bymotorcycle',
        'pedestrian_injured_bybusvan',
        'pedestrian_injured_bycar',
        'pedestrian_injured_bysuv',
        'pedestrian_injured_bytruck',
        'pedestrian_injured_byother',
      ],
    },
    fatality: {
      cyclist: [
        'cyclist_killed',
        'cyclist_killed_bybike',
        'cyclist_killed_byscooter',
        'cyclist_killed_bymotorcycle',
        'cyclist_killed_bybusvan',
        'cyclist_killed_bycar',
        'cyclist_killed_bysuv',
        'cyclist_killed_bytruck',
        'cyclist_killed_byother',
      ],
      motorist: [
        'motorist_killed',
        'motorist_killed_bybike',
        'motorist_killed_byscooter',
        'motorist_killed_bymotorcycle',
        'motorist_killed_bybusvan',
        'motorist_killed_bycar',
        'motorist_killed_bysuv',
        'motorist_killed_bytruck',
        'motorist_killed_byother',
      ],
      pedestrian: [
        'pedestrian_killed',
        'pedestrian_killed_bybike',
        'pedestrian_killed_byscooter',
        'pedestrian_killed_bymotorcycle',
        'pedestrian_killed_bybusvan',
        'pedestrian_killed_bycar',
        'pedestrian_killed_bysuv',
        'pedestrian_killed_bytruck',
        'pedestrian_killed_byother',
      ],
    },
  };

  // array to contain the desired field names from above inner properties
  let fields = [];

  // populate above with desired field names
  Object.keys(filterType).forEach(type => {
    Object.keys(filterType[type]).forEach(subtype => {
      if (filterType[type][subtype]) {
        fields = fields.concat(lookup[type][subtype]);
      }
    });
  });

  return fields;
});

// returns the array of objects for a primary entity
// returns the array of objects for a secondary entity
// returns the array of objects for the customGeography entity
const primaryEntityValuesSelector = state => state.entities.primary.values;
const secondaryEntityValuesSelector = state => state.entities.secondary.values;
const customEntityValuesSelector = state => {
  const records = state.data.custom.response ? state.data.custom.response : [];
  return records;
};

// returns array of objects for the reference entity
// reference entity is used for the line chart only and may be either "citywide" or a borough name
const referenceEntityValuesSelector = state => {
  const { entities } = state;
  const { reference } = entities;
  if (reference === 'citywide' && state.data.citywide.response) {
    return state.data.citywide.response;
  }
  if (reference === 'custom' && state.data.custom.response) {
    return state.data.custom.response;
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

  if (entity === 'custom') {
    return customEntityValuesSelector;
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

// helper function that given an array of values and array of field types,
// returns values with the some of and that only include those fields
const reduceValuesByType = (values, fields) =>
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
        // count shoudl not include sub injuries and fatalities such as 'cyclist_injured_bybike'
        if (!key.includes('_by')) {
          o.count += cur[key];
        }
        o[key] = cur[key];
      });

    acc.push(o);
    return acc;
  }, []);

/**
  * Factory function that returns a Memoized Selector which filters an entity's values by crash types
  * but returns the data for the full date range
  * @param {string} entity: type of geographic entity to filter for
  * @returns {function}: memoized selector
*/
const valuesFilteredByTypeSelector = entity =>
  createSelector(entityValuesSelector(entity), filterTypeFieldsSelector, reduceValuesByType);

/**
  * Memoized Selectors that filters an entity values by crash types
  * @param {object} state: redux state / store
  * @param {object} props: react props passed to the component instance
  * @returns {array}: filtered version of store.entities.<entity>.values
*/
export const primaryAllDatesSelector = valuesFilteredByTypeSelector('primary');
export const secondaryAllDatesSelector = valuesFilteredByTypeSelector('secondary');
export const referenceAllDatesSelector = valuesFilteredByTypeSelector('reference');

/**
  * Factory function that returns a Memoized Selector that filters an entity values by crash types and date range
  * @param {string} entity: type of geographic entity to filter for
  * @returns {function}: memoized selector
*/
const valuesFilteredByDateTypeSelector = entity =>
  createSelector(valuesByDateRangeSelector(entity), filterTypeFieldsSelector, reduceValuesByType);

/**
  * Memoized Selectors that filters an entity values by crash types and date range
  * @param {object} state: redux state / store
  * @param {object} props: react props passed to the component instance
  * @returns {array}: filtered version of store.entities.<entity>.values
*/
export const primaryEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('primary');
export const secondaryEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('secondary');
export const referenceEntityValuesFilteredSelector = valuesFilteredByDateTypeSelector('reference');
export const customGeographyValuesFilteredSelector = valuesFilteredByDateTypeSelector('custom');
