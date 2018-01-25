// this module contains template strings that form SQL queries that are passed to CARTO's SQL API
import sls from 'single-line-string'; // sls turns a multiline string into a single line

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
    WHERE ${geo} IS NOT NULL
    AND ${geo}::text != ''
    AND the_geom IS NOT NULL
    GROUP BY year_month, ${geo}
    ORDER BY year_month asc, ${geo} asc
  `;

export const sqlIntersection = () => {
  // tip for writing more "what places exist?" queries in the future
  // - the "geo" given to trigger this query, is presumed to be the name of a field,
  // e.g. "intersection" query should have a "intersection" field, being a unique ID ("key")

  // specific to Intersections though:
  // they do not have unique names, e.g. SMITH ST & OAK AVE could intersect multiple times
  // so our unique ID is concat'd name|id
  // labelFormatters.js entityIdDisplay() and entityLabelDisplay() tease these apart for label purposes vs ID purposes

  const maxintersections = 500;
  return sls`
    SELECT
      CONCAT(intersections.name, '|', intersections.cartodb_id) AS intersection,
      COUNT(c.cartodb_id) as total_crashes,
      SUM(c.number_of_cyclist_injured) as cyclist_injured,
      SUM(c.number_of_cyclist_killed) as cyclist_killed,
      SUM(c.number_of_motorist_injured) as motorist_injured,
      SUM(c.number_of_motorist_killed) as motorist_killed,
      SUM(c.number_of_pedestrian_injured) as pedestrian_injured,
      SUM(c.number_of_pedestrian_killed) as pedestrian_killed,
      SUM(c.number_of_pedestrian_injured + c.number_of_cyclist_injured + c.number_of_motorist_injured) as persons_injured,
      SUM(c.number_of_pedestrian_killed + c.number_of_cyclist_killed + c.number_of_motorist_killed) as persons_killed,
      c.year || '-' || LPAD(c.month::text, 2, '0') as year_month
    FROM
      crashes_all_prod c,
      (SELECT * FROM nyc_intersections WHERE crashcount IS NOT NULL ORDER BY crashcount DESC LIMIT ${maxintersections}) intersections
    WHERE
      c.the_geom IS NOT NULL AND ST_CONTAINS(intersections.the_geom, c.the_geom)
    GROUP BY year_month, intersection
    ORDER BY year_month asc, intersection asc
  `;
};

export const sqlCustomGeography = latlngs => {
  // latlngs param is a "coordinatelist" e.g. from customGeography
  // compose WKT to find crashes contained within this polygonal area
  const wkt = sls`
    ST_GEOMFROMTEXT(
      'POLYGON((${latlngs.map(coord => [coord[0], coord[1]].join(' ')).join(', ')}))'
      , 4326
    )
  `;

  return sls`
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
    WHERE ST_CONTAINS(${wkt}, the_geom)
    GROUP BY year, month
    ORDER BY year asc, month asc
  `;
};
