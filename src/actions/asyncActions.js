import axios from 'axios';
import { sqlByGeo, sqlCitywide } from '../common/sqlQueries';

import { cartoUser } from '../common/config';
import { parseDate } from '../common/d3Utils';
import { ENTITY_DATA_REQUEST, ENTITY_DATA_SUCCESS, ENTITY_DATA_ERROR } from '../common/actionTypes';

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

// catch any error that may have occured from the async request
const handleEntityDataError = error => ({
  type: ENTITY_DATA_ERROR,
  error,
});

// fetches aggregated crash data via the CARTO SQL API
// @param {string} entityType The geographic type to fetch data for (borough, city_council, citywide, etc.)
export default function fetchEntityData(entityType) {
  const sql = entityType === 'citywide' ? sqlCitywide() : sqlByGeo(entityType);

  return dispatch => {
    // tell our app we are fetching data
    dispatch(requestEntityData());

    // CARTO API endpoint using entityType
    const url = `https://${cartoUser}.carto.com/api/v2/sql?q=${encodeURIComponent(sql)}`;

    return axios(url)
      .then(result => {
        // check to see that we have a valid response
        if (!result || !result.data || !result.data.rows) {
          const error = Error('There was a problem loading data');
          handleEntityDataError(error);
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
      .catch(error => handleEntityDataError(error));
  };
}
