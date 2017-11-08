import React from 'react';
import SvgFile from '../../assets/icons/loading.svg';

// turn our SVG file into a React Component so that we can use CSS overrides
const SvgSpinner = props => <SvgFile {...props} />;

export default () => (
  <div className="LoadingMsg">
    <SvgSpinner className="SvgSpinner" width="25" height="25" />
    <h5>Loading Data...</h5>
  </div>
);
