import { combineReducers } from 'redux';
import { createResponsiveStateReducer } from 'redux-responsive';

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

export default rootReducer;
