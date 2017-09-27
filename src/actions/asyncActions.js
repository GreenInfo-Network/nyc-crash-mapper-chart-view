import axios from 'axios';
import { nest, sum, max } from 'd3';

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

// this is the start of an abstracted Array.prototype.sort function, might be more trouble than it's
// worth though...
function sort(arr, prop, asc) {
  const sortVal = asc ? -1 : 1;
  const sortVal2 = asc ? 1 : -1;

  arr.sort((a, b) => {
    if (a[prop] > b[prop]) return sortVal;
    if (a[prop] < b[prop]) return sortVal2;
    return 0;
  });
}

export default function fetchEntityData() {
  const url = 'data/inj_fat_city_councils_all_years.json';

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

        // TO DO: move this date parsing & formatting logic to a separate function so that it may be reused
        // parse date string into a date object
        response.forEach(d => {
          d.year_month = parseDate(d.year_month);
        });

        // nest data by identifier id;
        const nested = nest()
          .key(d => d.council) // need to know identifier field here, can't hard code
          .entries(response);

        // compute max number of category, necessary for yScale.domain()
        // compute sum of category, so that councils may be sorted from max to min
        // category currently hardcoded to pedestrian_injured, this should be variable
        nested.forEach(entity => {
          entity.maxPedInj = max(entity.values, d => d.pedestrian_injured);
          entity.maxCycInj = max(entity.values, d => d.cyclist_injured);
          entity.maxMotInj = max(entity.values, d => d.motorist_injured);
          entity.maxPedFat = max(entity.values, d => d.pedestrian_killed);
          entity.maxCycFat = max(entity.values, d => d.cyclist_killed);
          entity.maxMotFat = max(entity.values, d => d.motorist_killed);

          entity.totalPedInj = sum(entity.values, d => d.pedestrian_injured);
          entity.totalCycInj = sum(entity.values, d => d.cyclist_injured);
          entity.totalMotInj = sum(entity.values, d => d.motorist_injured);
          entity.totalPedFat = sum(entity.values, d => d.pedestrian_killed);
          entity.totalCycFat = sum(entity.values, d => d.cyclist_killed);
          entity.totalMotFat = sum(entity.values, d => d.motorist_killed);
        });

        // sort descending by total ped injuries (rank)
        sort(nested, 'totalPedInj', true);

        // store the ranking as a data value
        nested.forEach((d, i) => {
          d.rank = i;
        });

        // update redux state with response & nested data
        dispatch(receiveEntityData(response, nested));
      })
      .catch(error => handleEntityDataError(error));
  };
}
