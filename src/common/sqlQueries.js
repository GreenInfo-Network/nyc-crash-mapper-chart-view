// this module contains template strings that form SQL queries that are passed to CARTO's SQL API
import sls from 'single-line-string'; // sls turns a multiline string into a single line

// SQL Helper functions
// Query that maps the filterType part of Redux state to "number_of_<x>_<y>" strings
// @param {object} personTypes Either filterType.injury or filterType.fatality
// @param {string} harmType Either "injury" or "fatality"
// @returns {string} concatenated list of strings e.g. "number_of_pedestrian_injured, number_of_cyclist_injured"
const mapTypes = (filterTypePart, harmType) =>
  Object.keys(filterTypePart)
    .filter(type => filterTypePart[type])
    .map(type => {
      const term = harmType === 'injury' ? 'injured' : 'killed';
      return `number_of_${type}_${term}`;
    })
    .join(' + ');

// Check if geo === 'borough', if so normalize borough spellings,
// because NYC Open Data people have 11 spellings of NYC Boroughs...
const normalizeGeoRegExp = (geo, x) => {
  if (geo === 'borough') {
    const term = x ? 'borough' : 'borough_normalized';
    return `regexp_replace(lower(borough), '^the ', '') as ${term}`;
  }

  return geo;
};

const normalizeGeoNorm = geo => (geo === 'borough' ? 'borough_normalized' : geo);
const normalizeGeoAlias = geo =>
  geo === 'borough' ? 'b.borough_normalized as borough' : `b.${geo}`;

// Sparklines and Ranking combined using sub queries
// @param {string} geo The geographic entity type (e.g. "city_council")
// @param {object} filterType
// @returns SQL string
export const sqlSparklinesRanked = (geo, filterType) => {
  const { injury, fatality } = filterType;
  const orderBy = [];
  const sum1 = [];
  const sum2 = [];
  const sumInjured = mapTypes(injury, 'injury');
  const sumKilled = mapTypes(fatality, 'fatality');

  if (sumInjured.length) {
    orderBy.push('_.injuries DESC');
    sum1.push(`SUM(${sumInjured}) as injuries`);
    sum2.push(sumInjured);
  }

  if (sumKilled.length) {
    orderBy.push('_.fatalities DESC');
    sum1.push(`SUM(${sumKilled}) as fatalities`);
    sum2.push(sumKilled);
  }

  if (!sumKilled.length && !sumInjured.length) {
    // user selected nothing to filter by
    return '';
  }

  return sls`
    SELECT
    ${normalizeGeoAlias(geo)},
    b.year_month,
    b.total,
    a.rank
    FROM (
      SELECT
      _.${normalizeGeoNorm(geo)},
      rank() OVER (ORDER BY ${orderBy.join(',')})
      FROM (
        SELECT
          ${normalizeGeoRegExp(geo)},
          ${sum1.join(',')}
        FROM crashes_all_prod
        WHERE ${geo} IS NOT NULL
        AND ${geo}::text != ''
        AND the_geom IS NOT NULL
        AND date_val >= now() - interval '3 years'
        GROUP BY ${normalizeGeoNorm(geo)}
      ) AS _
    ) AS a,
    (
      SELECT
        SUM(${sum2.join(' + ')}) as total,
        ${normalizeGeoRegExp(geo)},
        year || '-' || LPAD(month::text, 2, '0') as year_month
      FROM
        crashes_all_prod c
      WHERE ${geo} IS NOT NULL
      AND ${geo}::text != ''
      AND the_geom IS NOT NULL
      GROUP BY ${normalizeGeoNorm(geo)}, year_month
    ) AS b
    WHERE a.${normalizeGeoNorm(geo)} = b.${normalizeGeoNorm(geo)}
    ORDER BY b.year_month ASC, b.${normalizeGeoNorm(geo)} ASC
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
      ${normalizeGeoRegExp(geo, true)},
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
    WHERE ${geo} IS NOT NULL
    AND ${geo}::text != ''
    AND the_geom IS NOT NULL
    GROUP BY year_month, ${geo}
    ORDER BY year_month asc, ${geo} asc
  `;
