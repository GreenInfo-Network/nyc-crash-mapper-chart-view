import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import { formatDate, findDateDiffInMonths } from '../../common/d3Utils';

const LineChartTitle = props => {
  const { title, startDate, endDate, children } = props;

  const howmanymonths = findDateDiffInMonths(startDate, endDate);
  const monthsword = howmanymonths > 1 ? 'months' : 'month';

  return (
    <div className="LineChartTitle">
      <span>
        <h6>{title}</h6>
        <h6>
          {formatDate(startDate)} — {formatDate(endDate)} ({howmanymonths} {monthsword})
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
