import axios from 'axios';

import { ENTITY_DATA_REQUEST, ENTITY_DATA_SUCCESS, ENTITY_DATA_ERROR } from '../common/actionTypes';

const requestEntityData = () => ({
  type: ENTITY_DATA_REQUEST,
});

const receiveEntityData = json => ({
  type: ENTITY_DATA_SUCCESS,
  json,
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
        if (!result || !result.data) {
          throw new Error('problem with data request');
        }
        dispatch(receiveEntityData(result.data));
      })
      .catch(error => handleEntityDataError(error));
  };
}
