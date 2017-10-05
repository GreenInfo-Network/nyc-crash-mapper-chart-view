// this module contains template strings that form SQL queries that are passed to CARTO's SQL API
import sls from 'single-line-string'; // sls turns a multiline string into a single line

// SQL Helper functions
// maps the filterType part of Redux state to "number_of_<x>_<y>" strings
const mapTypes = (personTypes, harmType) =>
  Object.keys(personTypes)
    .filter(type => personTypes[type])
    .map(type => {
      const term = harmType === 'injury' ? 'injured' : 'killed';
      return `number_of_${type}_${term}`;
    })
    .join(' + ');

// Query that determines rank for SparkLineList items
export const sqlRank = (geo, filterType) => {
  const { injury, fatality } = filterType;
  const select = [];
  const orderBy = [];
  const sum = [];
  const sumInjured = mapTypes(injury, 'injury');
  const sumKilled = mapTypes(fatality, 'fatality');

  if (sumInjured.length) {
    select.push('injuries');
    orderBy.push('injuries DESC');
    sum.push(`SUM(${sumInjured}) as injuries`);
  }

  if (sumKilled.length) {
    select.push('fatalities');
    orderBy.push('fatalities DESC');
    sum.push(`SUM(${sumKilled}) as fatalities`);
  }

  if (!sumInjured.length && !sumKilled.length) {
    // something went wrong, bail
    return '';
  }

  return sls`
    SELECT ${geo}, ${select},
    rank() OVER (ORDER BY ${orderBy})
    FROM (
      SELECT
        COUNT(cartodb_id) as total_crashes,
        ${geo},
        ${sum}
      FROM crashes_all_prod c
      WHERE ${geo} IS NOT NULL OR ${geo}::text != ''
      AND the_geom IS NOT NULL
      AND date_val >= now() - interval '3 years'
      GROUP BY ${geo}
    ) AS _
    ORDER BY rank ASC
  `;
};

// Query for Sparklines
export const sqlSparkLines = (geo, filterType) => {
  const { injury, fatality } = filterType;
  const sumInjured = mapTypes(injury, 'injury');
  const sumKilled = mapTypes(fatality, 'fatality');
  const count = [sumInjured, sumKilled].join(' + ');

  return sls`
    SELECT
      COUNT(c.cartodb_id) as total_crashes,
      ${geo},
      SUM(${count}) as count,
      year || '-' || LPAD(month::text, 2, '0') as year_month
    FROM crashes_all_prod c
    WHERE ${geo} IS NOT NULL OR ${geo}::text != ''
    AND the_geom IS NOT NULL
    GROUP BY year, month, ${geo}
    ORDER BY year asc, month asc, ${geo} asc
  `;
};

// Query that returns aggregated data for entire city, note this will include data that hasn't been geocoded
export const sqlCitywide = () => sls`
  SELECT
    COUNT(c.cartodb_id) as total_crashes,
    SUM(c.number_of_cyclist_injured) as cyclist_injured,
    SUM(c.number_of_cyclist_killed) as cyclist_killed,
    SUM(c.number_of_motorist_injured) as motorist_injured,
    SUM(c.number_of_motorist_killed) as motorist_killed,
    SUM(c.number_of_pedestrian_injured) as pedestrian_injured,
    SUM(c.number_of_pedestrian_killed) as pedestrian_killed,
    SUM(c.number_of_pedestrian_injured + c.number_of_cyclist_injured + c.number_of_motorist_injured) as persons_injured,
    SUM(c.number_of_pedestrian_killed + c.number_of_cyclist_killed + c.number_of_motorist_killed) as persons_killed,
    year || '-' || LPAD(month::text, 2, '0') as year_month
  FROM
    crashes_all_prod c
  GROUP BY year, month
  ORDER BY year asc, month asc
`;

// Query that returns aggregated data by geography, such as Borough or City Council Districts
// @param {string} geo Name of column for a given geography for use in the SQL group by clause
export const sqlByGeo = geo =>
  sls`
    SELECT
      COUNT(c.cartodb_id) as total_crashes,
      ${geo},
      SUM(c.number_of_cyclist_injured) as cyclist_injured,
      SUM(c.number_of_cyclist_killed) as cyclist_killed,
      SUM(c.number_of_motorist_injured) as motorist_injured,
      SUM(c.number_of_motorist_killed) as motorist_killed,
      SUM(c.number_of_pedestrian_injured) as pedestrian_injured,
      SUM(c.number_of_pedestrian_killed) as pedestrian_killed,
      SUM(c.number_of_pedestrian_injured + c.number_of_cyclist_injured + c.number_of_motorist_injured) as persons_injured,
      SUM(c.number_of_pedestrian_killed + c.number_of_cyclist_killed + c.number_of_motorist_killed) as persons_killed,
      year || '-' || LPAD(month::text, 2, '0') as year_month
    FROM crashes_all_prod c
    WHERE ${geo} IS NOT NULL OR ${geo}::text != ''
    AND the_geom IS NOT NULL
    GROUP BY year, month, ${geo}
    ORDER BY year asc, month asc, ${geo} asc
  `;
