import axios from 'axios';
import { sqlByGeo, sqlCitywide, sqlSparklinesRanked } from '../common/sqlQueries';

import { cartoUser } from '../common/config';
import { parseDate } from '../common/d3Utils';
import {
  ENTITY_DATA_REQUEST,
  ENTITY_DATA_SUCCESS,
  ENTITY_DATA_ERROR,
  RANK_DATA_REQUEST,
  RANK_DATA_SUCCESS,
  RANK_DATA_ERROR,
} from '../common/actionTypes';

// CARTO SQL API endpoint
const url = `https://${cartoUser}.carto.com/api/v2/sql`;

// set defaults for axios http client
axios.defaults.baseURL = url;
// eslint-disable-next-line
axios.defaults.validateStatus = function(status) {
  // reject anything greater than a 400
  return status < 400;
};

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

// generic async error handling action
const handleError = (type, error) => {
  let errorMsg = 'Something went wrong';

  // check for various parts of the error response provided by Axios
  if (error.response) {
    errorMsg = error.response.statusText;
  } else if (error.request) {
    errorMsg = error.request;
  } else {
    errorMsg = error.message;
  }

  return {
    type,
    error: errorMsg,
  };
};

// fetches aggregated crash data via the CARTO SQL API
// @param {string} entityType The geographic type to fetch data for (borough, city_council, citywide, etc.)
export default function fetchEntityData(entityType) {
  const sql = entityType === 'citywide' ? sqlCitywide() : sqlByGeo(entityType);

  return dispatch => {
    // tell our app we are fetching data
    dispatch(requestEntityData());

    // use axios library to make the GET request to the CARTO API with the SQL query from above
    return axios({
      method: 'get',
      params: {
        q: sql,
      },
    })
      .then(result => {
        // eslint-disable-next-line
        console.log(result);
        // check to see that we have a valid response
        if (!result || !result.data || !result.data.rows) {
          const error = Error({
            message: 'There was a problem loading data',
          });
          dispatch(handleError(ENTITY_DATA_ERROR, error));
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
      .catch(error => dispatch(handleError(ENTITY_DATA_ERROR, error)));
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
  const sql = sqlSparklinesRanked(entityType, filterType);

  if (!sql.length) {
    // TO DO: user has no crash type filters selected, prevent them from doing so?
    const error = Error({
      message: 'No crash types selected',
    });
    return dispatch => dispatch(handleError(RANK_DATA_ERROR, error));
  }

  return dispatch => {
    dispatch(requestRankData());

    return axios({
      method: 'get',
      params: {
        q: sql,
      },
    })
      .then(result => {
        if (!result || !result.data || !result.data.rows) {
          const error = Error({
            message: 'error loading data',
          });
          dispatch(handleError(RANK_DATA_ERROR, error));
        }

        const response = result.data.rows;

        // parse date string into a date object
        response.forEach(d => {
          d.year_month = parseDate(d.year_month);
        });

        dispatch(receiveRankData(entityType, response));
      })
      .catch(error => dispatch(handleError(RANK_DATA_ERROR, error)));
  };
};
