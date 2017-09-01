import axios from 'axios';
import { nest } from 'd3';

import { parseDate } from '../common/d3Utils';
import { ENTITY_DATA_REQUEST, ENTITY_DATA_SUCCESS, ENTITY_DATA_ERROR } from '../common/actionTypes';

const requestEntityData = () => ({
  type: ENTITY_DATA_REQUEST,
});

const receiveEntityData = (response, nested) => ({
  type: ENTITY_DATA_SUCCESS,
  response,
  nested,
});

const handleEntityDataError = error => ({
  type: ENTITY_DATA_ERROR,
  error,
});

export default function fetchEntityData() {
  const url = '/data/inj_fat_city_councils_all_years.json';

  return dispatch => {
    dispatch(requestEntityData());
    return axios(url)
      .then(result => {
        // check to see that we have a valid response
        if (!result || !result.data || !result.data.length) {
          throw new Error('problem with data request');
        }
        // alias
        const response = result.data;

        // parse date string into a date object
        response.forEach(d => {
          d.year_month = parseDate(d.year_month);
        });

        // nest data by identifier id;
        const nested = nest()
          .key(d => d.council) // need to know identifier field here, can't hard code
          .entries(response);

        // update redux state with response & nested data
        dispatch(receiveEntityData(response, nested));
      })
      .catch(error => handleEntityDataError(error));
  };
}
