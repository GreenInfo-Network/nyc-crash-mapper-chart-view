import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

import mapFilterTypesToProps, { filterValuesByDateRange } from '../common/utils';

import filterType from './filterByTypeReducer';
import entities from './entitiesReducer';
import data from './dataReducer';
import dateRanges from './dateRangeReducer';
import trendCompare from './trendCompareReducer';

// breakpoints to match Skeleton CSS's
const browser = createResponsiveStateReducer(
  {
    extraSmall: 400,
    small: 550,
    medium: 750,
    large: 1000,
    extraLarge: 1200,
  },
  {
    extraFields: () => ({
      width: window.innerWidth,
      height: window.innerHeight,
    }),
  }
);

const rootReducer = combineReducers({
  browser,
  data,
  dateRanges,
  entities,
  filterType,
  trendCompare,
});

/**
 * Selector function that returns response & nested data for a given geographic entity
 * @param {object} state: redux state / store
 * @returns {object} part of redux store.data for the current geographic entity
 */
export const allEntityData = state => {
  // eslint-disable-next-line
  const { entities, data } = state;
  const { entityType } = entities;

  if (!data[entityType]) {
    // no data has been cached for the current geography, hit the API to grab data
    // the empty arrays will be diffed by the App component which will then call the
    // appropriate action to request new data
    return {
      response: [],
      ranked: [],
    };
  }

  return data[entityType];
};

/**
 * Returns values for primary and secondary entities filtered by both date range groups
 * @param {object} state: redux state / store
 */
export const filterEntitiesValues = state => {
  // eslint-disable-next-line
  const { entities, dateRanges, filterType } = state;
  const { primary, secondary } = entities;
  const { period1, period2 } = dateRanges;

  return {
    valuesDateRange1: {
      primary: {
        ...primary,
        values: mapFilterTypesToProps(
          filterType,
          filterValuesByDateRange(primary.values, period1.startDate, period1.endDate)
        ),
      },
      secondary: {
        ...secondary,
        values: mapFilterTypesToProps(
          filterType,
          filterValuesByDateRange(secondary.values, period1.startDate, period1.endDate)
        ),
      },
    },
    valuesDateRange2: {
      primary: {
        ...primary,
        values: mapFilterTypesToProps(
          filterType,
          filterValuesByDateRange(primary.values, period2.startDate, period2.endDate)
        ),
      },
      secondary: {
        ...secondary,
        values: mapFilterTypesToProps(
          filterType,
          filterValuesByDateRange(secondary.values, period2.startDate, period2.endDate)
        ),
      },
    },
  };
};

export default rootReducer;
