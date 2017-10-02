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
    const o = {};
    o.count = 0;
    o.year_month = cur.year_month;

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
