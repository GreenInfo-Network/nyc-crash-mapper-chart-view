import { applyMiddleware, createStore, compose } from 'redux';
import { createResponsiveStoreEnhancer, calculateResponsiveState } from 'redux-responsive';
import debounce from 'lodash/debounce';

import rootReducer from './reducers/';
import middleware from './middleware';
import hydrateState from './common/reduxHydrateState';

// This configures our Redux "store", the part of Redux that handles storing application state
// it includes middleware, such as redux-thunk and redux-logger, see the docs for more info:
// http://redux.js.org/docs/advanced/Middleware.html
function makeStore(initialState) {
  const store = createStore(
    rootReducer,
    initialState,
    compose(
      createResponsiveStoreEnhancer(500), // throttle time
      applyMiddleware(...middleware)
    )
  );

  if (module.hot) {
    // Enable Webpack's "hot module replacement" for Redux reducers
    module.hot.accept('./reducers', () => {
      // eslint-disable-next-line
      const nextReducer = require('./reducers/index').default;
      store.replaceReducer(nextReducer);
    });
  }

  return store;
}

const initialState = hydrateState();
const store = makeStore(initialState);

// fire redux-responsive on window resize event
window.addEventListener(
  'resize',
  debounce(() => store.dispatch(calculateResponsiveState(window)), 150)
);

export default store;
