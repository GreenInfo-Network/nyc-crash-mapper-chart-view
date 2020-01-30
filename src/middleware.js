import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import isEqual from 'lodash.isequal';

import updateQueryParams from './common/updateBrowserHistory';
import { clearEntitiesDataCache } from './actions';

const middleware = [thunkMiddleware];

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // redux-logger only works in a browser environment
  middleware.push(logger);
}

// custom middleware that will update browser history when state changes
// means changing the URL query string and saving a state object to history.state
// see Redux docs for more info: http://redux.js.org/docs/advanced/Middleware.html
const saveState = store => next => action => {
  const result = next(action);
  const state = store.getState();
  updateQueryParams(state);
  return result;
};

middleware.push(saveState);

const maybeClearDataCache = store => next => action => {
  const { filterVehicle: filterVehiclePrev } = store.getState();
  const result = next(action);
  const { filterVehicle: filterVehicleCur } = store.getState();

  // diff the filterVehicle states to see if they changed
  if (!isEqual(filterVehiclePrev.vehicle, filterVehicleCur.vehicle)) {
    // if they're different clear all cached data so that charts re-render
    store.dispatch(clearEntitiesDataCache());
  }

  return result;
};

middleware.push(maybeClearDataCache);

export default middleware;
