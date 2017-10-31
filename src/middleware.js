import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';
import updateQueryParams from './common/updateQueryParams';

const middleware = [thunkMiddleware];

if (typeof window !== 'undefined' && process.env.NODE_ENV !== 'production') {
  // redux-logger only works in a browser environment
  middleware.push(logger);
}

const updateUrlHash = store => next => action => {
  const state = store.getState();
  updateQueryParams(state);
  next(action);
};

middleware.push(updateUrlHash);

export default middleware;
