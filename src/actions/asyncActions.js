import axios from 'axios';
import { nest, sum, max } from 'd3';
import { sqlByGeo } from '../common/sqlQueries';

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
const receiveEntityData = (geo, response, nested) => ({
  type: ENTITY_DATA_SUCCESS,
  geo,
  response,
  nested,
});

// catch any error that may have occured from the async request
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
  return (dispatch, getState) => {
    // tell our app we are fetching data
    dispatch(requestEntityData());
    // the geographic entity that is currently selected
    const entityType = getState().entities.entityType;
    // CARTO API endpoint using entityType
    const url = `https://${cartoUser}.carto.com/api/v2/sql?q=${encodeURIComponent(
      sqlByGeo(entityType)
    )}`;

    return axios(url)
      .then(result => {
        // check to see that we have a valid response
        if (!result || !result.data || !result.data.rows) {
          const error = Error('There was a problem loading data');
          handleEntityDataError(error);
        }

        // the response success
        const response = result.data.rows;

        // TO DO: move this date parsing & formatting logic to a separate function so that it may be reused
        // parse date string into a date object
        response.forEach(d => {
          d.year_month = parseDate(d.year_month);
        });

        // nest data by identifier id;
        const nested = nest()
          .key(d => d[entityType])
          .entries(response);

        /*
         * Move this logic to somewhere else so that when date range or crash types are changed
         * total & max can be re-computed
         * data can be re-sorted (ranked)
        */
        // compute max number of category, necessary for yScale.domain()
        // compute sum of category, so that councils may be sorted from max to min
        // TO DO: category currently hardcoded to total persons injured, should be set via UI
        nested.forEach(entity => {
          entity.maxPedInj = max(entity.values, d => d.pedestrian_injured);
          entity.maxCycInj = max(entity.values, d => d.cyclist_injured);
          entity.maxMotInj = max(entity.values, d => d.motorist_injured);
          entity.maxInj = max(entity.values, d => d.persons_injured);
          entity.maxPedFat = max(entity.values, d => d.pedestrian_killed);
          entity.maxCycFat = max(entity.values, d => d.cyclist_killed);
          entity.maxMotFat = max(entity.values, d => d.motorist_killed);
          entity.maxFat = max(entity.values, d => d.persons_killed);

          entity.totalPedInj = sum(entity.values, d => d.pedestrian_injured);
          entity.totalCycInj = sum(entity.values, d => d.cyclist_injured);
          entity.totalMotInj = sum(entity.values, d => d.motorist_injured);
          entity.totalInj = sum(entity.values, d => d.persons_injured);
          entity.totalPedFat = sum(entity.values, d => d.pedestrian_killed);
          entity.totalCycFat = sum(entity.values, d => d.cyclist_killed);
          entity.totalMotFat = sum(entity.values, d => d.motorist_killed);
          entity.totalFat = sum(entity.values, d => d.persons_killed);
        });

        // sort descending by total ped injuries (rank)
        sort(nested, 'totalInj', true);

        // store the ranking as a data value
        nested.forEach((d, i) => {
          d.rank = i;
        });

        // update redux state with response & nested data
        dispatch(receiveEntityData('city_council', response, nested));
      })
      .catch(error => handleEntityDataError(error));
  };
}
