import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

import entities from './entitiesReducer';
import data from './dataReducer';
import dateRanges from './dateRangeReducer';

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
});

/**
 * Returns values for primary and secondary entities filtered by both date range groups
 * @param {object} state: redux state / store
 */
export const filterEntitiesValues = state => {
  // eslint-disable-next-line
  const { entities, dateRanges } = state;
  const { primary, secondary } = entities;
  const { group1, group2 } = dateRanges;

  function filterValuesByDateRange(values, startDate, endDate) {
    // filters array of objects by date ranges
    return values.filter(d => {
      if (+d.year_month >= +startDate && +d.year_month <= +endDate) {
        return true;
      }
      return false;
    });
  }

  return {
    valuesDateRange1: {
      primary: {
        ...primary,
        values: filterValuesByDateRange(primary.values, group1.startDate, group1.endDate),
      },
      secondary: {
        ...secondary,
        values: filterValuesByDateRange(secondary.values, group1.startDate, group1.endDate),
      },
    },
    valuesDateRange2: {
      primary: {
        ...primary,
        values: filterValuesByDateRange(primary.values, group2.startDate, group2.endDate),
      },
      secondary: {
        ...secondary,
        values: filterValuesByDateRange(secondary.values, group2.startDate, group2.endDate),
      },
    },
  };
};

export default rootReducer;
