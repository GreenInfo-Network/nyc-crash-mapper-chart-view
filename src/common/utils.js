// this module contains utility functions for data processing that can be used throughout the app

// filters array of objects by a start and end date
// @param {array} values Array of objects representing data for a geographic area for a given year_month
// @param {date} startDate Min date for filtering by
// @param {date} endDate Max date for filtering by
export function filterValuesByDateRange(values, startDate, endDate) {
  return values.filter(d => {
    if (+d.year_month >= +startDate && +d.year_month <= +endDate) {
      return true;
    }
    return false;
  });
}

// @function mapFilterTypesToProps
// maps selected crash type filters from store.filterTypes to filter entity data values attributes
// output is an array of objects that includes the sum of each crash type selected
// @param {object} filterType Currently selected crash type filters in store.filterType
// @param {array} values Array of objects of data filtered by date range
const mapFilterTypesToProps = (filterType, values) => {
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
    noInjuryFatality: '', // TO DO...
  };

  const keys = [];

  Object.keys(filterType).forEach(type => {
    Object.keys(filterType[type]).forEach(subtype => {
      if (filterType[type][subtype]) {
        keys.push(lookup[type][subtype]);
      }
    });
  });

  return values.reduce((acc, cur) => {
    const o = { ...cur }; // need to keep "year_month" and "<entity_type>" properties
    o.count = 0;

    Object.keys(cur).forEach(key => {
      if (keys.indexOf(key) !== -1) {
        o.count += cur[key];
      }
    });

    acc.push(o);

    return acc;
  }, []);
};

export default mapFilterTypesToProps;

// this is the start of an abstracted Array.prototype.sort function,
// might be more trouble than it's worth though...
export function sort(arr, prop, asc) {
  const sortVal = asc ? -1 : 1;
  const sortVal2 = asc ? 1 : -1;

  arr.sort((a, b) => {
    if (a[prop] > b[prop]) return sortVal;
    if (a[prop] < b[prop]) return sortVal2;
    return 0;
  });
}
