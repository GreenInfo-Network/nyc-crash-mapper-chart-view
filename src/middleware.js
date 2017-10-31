import thunkMiddleware from 'redux-thunk';
import logger from 'redux-logger';

import updateQueryParams from './common/updateBrowserHistory';

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

export default middleware;
