// This module contains the logic for parsing URL query params that are used to set initial app state:
// Query params exist for:
// - geographic type (entityType)
// - primary & secondary entity keys
// - reference entity (citywide or 1 of 5 boroughs)
// - crash fitler types (filterType)
// - date ranges (both start and end for periods 1 and 2)
// - chart view: trend, compare, rank
import qs from 'query-string';

import { parseDate } from './d3Utils';
import { entitiesInitalState } from '../reducers/entitiesReducer';

// valid strings for various parts of app state
const validGeographies = [
  'borough',
  'city_council',
  'community_board',
  'neighborhood',
  'nypd_precinct',
  'intersection',
];
const validRefGeos = [
  'citywide',
  'custom',
  'manhattan',
  'bronx',
  'queens',
  'brooklyn',
  'staten island',
];
const validViews = ['trend', 'compare', 'rank'];

// set up some default / fallback dates
const p1EndDefault = new Date();
p1EndDefault.setDate(1);
const p1StartDefault = new Date(p1EndDefault);
p1StartDefault.setFullYear(p1StartDefault.getFullYear() - 1);

const p2EndDefault = new Date(p1StartDefault);
const p2StartDefault = new Date(p2EndDefault);
p2StartDefault.setFullYear(p2StartDefault.getFullYear() - 1);

// test if a value is JSON parseable
const isJsonString = _ => {
  try {
    JSON.parse(_);
  } catch (e) {
    return false;
  }
  return true;
};

// test if a date is valid
const isValidDate = (val, fallback) => parseDate(val) || fallback;

const isValidPeriod1 = (strStart, strEnd) => {
  const startDate = parseDate(strStart);
  const endDate = parseDate(strEnd);

  if (startDate && endDate && +startDate !== +endDate) {
    return { startDate, endDate };
  }

  return {
    startDate: p1StartDefault,
    endDate: p1EndDefault,
  };
};

// test if geo / entity type is valid
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

// test if chart view is valid
const isValidView = _ => _ && validViews.includes(_);

// create the chart view state
// TO DO: trend compare will be refactored to trend, compare, rank; so leaving alone for now...
const setValidView = _ => {
  if (isValidView(_)) {
    return _;
  }
  return 'trend';
};

// test if something is a boolean value
const isBool = _ => typeof _ === 'boolean';

// make sure crash type values are booleans
const setValidFilterTypes = types => {
  const { cinj, minj, pinj, cfat, mfat, pfat } = types;
  const allTypesValid = [cinj, minj, pinj, cfat, mfat, pfat].every(type => isBool(type));

  if (allTypesValid) {
    return {
      injury: {
        cyclist: cinj,
        motorist: minj,
        pedestrian: pinj,
      },
      fatality: {
        cyclist: cfat,
        motorist: mfat,
        pedestrian: pfat,
      },
      noInjuryFatality: false,
    };
  }
  // default is just injury crash types selected
  return {
    injury: {
      cyclist: true,
      motorist: true,
      pedestrian: true,
    },
    fatality: {
      cyclist: false,
      motorist: false,
      pedestrian: false,
    },
    noInjuryFatality: false,
  };
};

// parses the URL query params
// returns an object for key values of each param
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

// @param {object} p Parsed query params object
// @returns {object} that may be used to "hydrate" the Redux store (app state)
const createInitialState = p => {
  const period1 = isValidPeriod1(p.p1start, p.p1end);

  return {
    dateRanges: {
      period1,
      period2: {
        // if there's not a valid period 2 start date, use the year prior to the start date of period 1 as the start date for period 2
        startDate: !parseDate(p.p2start)
          ? new Date(new Date(period1.startDate).setFullYear(period1.startDate.getFullYear() - 1))
          : isValidDate(p.p2start, p2StartDefault),
        // if there's not a valid period 2 END date, use the START date of period 1 as the END date for period 2
        endDate: !parseDate(p.p2end)
          ? new Date(period1.startDate)
          : isValidDate(p.p2end, p2EndDefault),
      },
    },
    entities: {
      ...entitiesInitalState,
      entityType: isValidGeo(p.geo),
      primary: {
        ...entitiesInitalState.primary, // keep other props (values, color, etc.)
        key: p.primary, // okay if left undefined and too difficult to validate
      },
      secondary: {
        ...entitiesInitalState.secondary, // keep other props (values, color, etc.)
        key: p.secondary, // okay if left undefined and too difficult to validate
      },
      reference: p.geo === 'custom' ? 'custom' : isValidRefGeo(p.reference), // geo=custom as special case, remaps to reference=custom for compatibility
    },
    chartView: setValidView(p.view),
    filterType: setValidFilterTypes(p),
    customGeography: p.lngLats,
    trendAggMonths: p.trendAggMonths,
  };
};

export default function() {
  const params = parseQueryParams();
  return createInitialState(params);
}
