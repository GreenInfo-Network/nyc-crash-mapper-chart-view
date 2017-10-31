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
  toggleTrendCompare: PropTypes.func.isRequired,
  trendCompare: pt.trendCompare.isRequired,
};

export default Header;
