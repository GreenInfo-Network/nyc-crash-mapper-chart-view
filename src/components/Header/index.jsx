import React from 'react';
import PropTypes from 'prop-types';
import * as pt from '../../common/reactPropTypeDefs';

import HeaderTitle from './HeaderTitle';
import Menu from './Menu';

const Header = props => (
  <div className="Header">
    <HeaderTitle />
    <Menu {...props} />
  </div>
);

Header.propTypes = {
  toggleChartView: PropTypes.func.isRequired,
  chartView: pt.chartView.isRequired,
};

export default Header;
