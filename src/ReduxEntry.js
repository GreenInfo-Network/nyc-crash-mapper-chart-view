import React from 'react';
import { Provider } from 'react-redux';

import store from './store';
import AppConnected from './containers/AppConnected';

// This component is what allows for integrating Redux with React through the
// react-redux library. Not a whole lot going on here at the moment, but this
// separation is useful when adding React Router later.
const ReduxEntry = () => (
  <Provider store={store}>
    <AppConnected />
  </Provider>
);

export default ReduxEntry;
