import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../common/reactPropTypeDefs';
import { formatDate } from '../common/d3Utils';

const LineChartTitle = props => {
  const { title, startDate, endDate, children } = props;
  return (
    <div className="LineChartTitle">
      <span>
        <h6>{title}</h6>
        <h6>
          {formatDate(startDate)} — {formatDate(endDate)}
        </h6>
      </span>
      {children}
    </div>
  );
};

LineChartTitle.propTypes = {
  title: PropTypes.string.isRequired,
  startDate: pt.date.isRequired,
  endDate: pt.date.isRequired,
  children: PropTypes.element,
};

LineChartTitle.defaultProps = {
  children: null,
};

export default LineChartTitle;
