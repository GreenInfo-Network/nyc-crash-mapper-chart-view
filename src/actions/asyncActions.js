import axios from 'axios';
import { sqlByGeo, sqlCitywide, sqlRank } from '../common/sqlQueries';

import { cartoUser } from '../common/config';
import { parseDate } from '../common/d3Utils';
import {
  ENTITY_DATA_REQUEST,
  ENTITY_DATA_SUCCESS,
  DATA_FETCH_ERROR,
  RANK_DATA_REQUEST,
  RANK_DATA_SUCCESS,
} from '../common/actionTypes';

// CARTO SQL API endpoint
const url = `https://${cartoUser}.carto.com/api/v2/sql?q=`;

// action that states we are making an async request
const requestEntityData = () => ({
  type: ENTITY_DATA_REQUEST,
});

// action that a async data request was successful
// @param {string} geo Geography Type
// @param {response} array Array of objects returned from the API call
// @param {nested} array Array of objects where each object contains nested data by geo identifier
const receiveEntityData = (geo, response) => ({
  type: ENTITY_DATA_SUCCESS,
  geo,
  response,
});

// generic error handling action
const handleError = error => ({
  type: DATA_FETCH_ERROR,
  error,
});

// fetches aggregated crash data via the CARTO SQL API
// @param {string} entityType The geographic type to fetch data for (borough, city_council, citywide, etc.)
export default function fetchEntityData(entityType) {
  const sql = entityType === 'citywide' ? sqlCitywide() : sqlByGeo(entityType);

  return dispatch => {
    // tell our app we are fetching data
    dispatch(requestEntityData());

    // use axios library to make the GET request to the CARTO API with the SQL query from above
    return axios(`${url}${encodeURIComponent(sql)}`)
      .then(result => {
        // check to see that we have a valid response
        if (!result || !result.data || !result.data.rows) {
          const error = Error('There was a problem loading data');
          dispatch(handleError(error));
        }

        // the response success
        const response = result.data.rows;

        // parse date string into a date object
        response.forEach(d => {
          d.year_month = parseDate(d.year_month);
        });

        // update redux state with response & nested data
        dispatch(receiveEntityData(entityType, response));
      })
      .catch(error => handleError(error));
  };
}

const requestRankData = () => ({
  type: RANK_DATA_REQUEST,
});

const receiveRankData = (geo, ranked) => ({
  type: RANK_DATA_SUCCESS,
  geo,
  ranked,
});

export const fetchRankData = (entityType, filterType) => {
  const sql = sqlRank(entityType, filterType);

  return dispatch => {
    dispatch(requestRankData());

    return axios(`${url}${encodeURIComponent(sql)}`)
      .then(result => {
        if (!result || !result.data || !result.data.rows) {
          dispatch(handleError('error fetching rank data'));
        }
        const response = result.data.rows;
        dispatch(receiveRankData(entityType, response));
      })
      .catch(error => handleError(error));
  };
};
