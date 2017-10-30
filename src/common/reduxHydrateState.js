// This module contains the logic for parsing and setting query params to track:
// - geographic type
// - primary & secondary selected entities
// - reference entity
// - crash fitler types
// - date ranges
// - chart view: trend, compare, rank
import qs from 'query-string';

import { parseDate } from './d3Utils';
import { entitiesInitalState } from '../reducers/entitiesReducer';

const validGeographies = ['borough', 'city_council', 'community_board', 'nta', 'nypd'];
const validRefGeos = ['citywide', 'manhattan', 'bronx', 'queens', 'brooklyn', 'staten island'];

// test if a value is JSON parseable
const isJsonString = _ => {
  try {
    JSON.parse(_);
  } catch (e) {
    return false;
  }
  return true;
};

// test if something is a boolean value
const isBool = _ => {
  if (_ && typeof _ === 'boolean') {
    return _;
  }
  return false;
};

// test if geo is valid
const isValidGeo = _ => {
  if (_ && validGeographies.includes(_)) {
    return _;
  }
  return validGeographies[1];
};

// test if reference geo is valid
const isValidRefGeo = _ => {
  if (_ && validRefGeos.includes(_)) {
    return _;
  }
  return validRefGeos[0];
};

// parses the URL query params
const parseQueryParams = () => {
  const q = qs.parse(location.search);

  return Object.keys(q).reduce((acc, key) => {
    const decoded = decodeURIComponent(q[key]);
    if (isJsonString(decoded)) {
      acc[key] = JSON.parse(decoded);
    } else {
      acc[key] = decoded;
    }
    return acc;
  }, {});
};

// uses URL query params to return an object that may be used to "hydrate" the Redux store (app state)
export default function() {
  const p = parseQueryParams();

  // set up some default dates
  const p1EndDefault = new Date();
  p1EndDefault.setDate(1);
  const p1StartDefault = new Date(p1EndDefault);
  p1StartDefault.setFullYear(p1StartDefault.getFullYear() - 1);

  const p2EndDefault = new Date(p1StartDefault);
  const p2StartDefault = new Date(p2EndDefault);
  p2StartDefault.setFullYear(p2StartDefault.getFullYear() - 1);

  return {
    dateRanges: {
      period1: {
        startDate: parseDate(p.p1start) || p1StartDefault,
        endDate: parseDate(p.p1end) || p1EndDefault,
      },
      period2: {
        startDate: parseDate(p.p2start) || p2StartDefault,
        endDate: parseDate(p.p2end) || p2EndDefault,
      },
    },
    entities: {
      entityType: isValidGeo(p.geo),
      primary: {
        ...entitiesInitalState.primary,
        key: p.primary, // okay if left undefined
      },
      secondary: {
        ...entitiesInitalState.secondary,
        key: p.secondary, // okay if left undefined
      },
      reference: isValidRefGeo(p.reference),
    },
    // TO DO: trend compare will be refactored to trend, compare, rank; so leaving alone for now...
    trendCompare: {
      trend: p.view === 'trend',
      compare: p.view === 'compare',
    },
    filterType: {
      injury: {
        cyclist: isBool(p.cinj),
        motorist: isBool(p.minj),
        pedestrian: isBool(p.pinj),
      },
      fatality: {
        cyclist: isBool(p.cfat),
        motorist: isBool(p.mfat),
        pedestrian: isBool(p.pfat),
      },
      noInjuryFatality: false,
    },
  };
}
