// this module contains template strings that form SQL queries that are passed to CARTO's SQL API
import sls from 'single-line-string'; // sls turns a multiline string into a single line

// aggregated data for entire city, note this will include data that hasn't been geocoded
export const sqlCitywide = sls`
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

// aggregated data for a given geography, such as City Council Districts
export const sqlByGeo = geoTable => sls`
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
  JOIN
    ${geoTable} a
  ON
    ST_Within(c.the_geom, a.the_geom)
  GROUP BY year, month
  ORDER BY year asc, month asc
`;
