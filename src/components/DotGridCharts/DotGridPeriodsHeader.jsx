import React from 'react';
import { timeFormat } from 'd3';

import * as pt from '../../common/reactPropTypeDefs';

const DotGridPeriodsHeader = props => {
  const { period1, period2 } = props.dateRanges;
  const formatTime = timeFormat('%b %Y');

  return (
    <div className="dot-grid-row">
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatTime(period1.startDate)} – ${formatTime(period1.endDate)}`}</h5>
        <h6>Period A</h6>
      </div>
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatTime(period2.startDate)} – ${formatTime(period2.endDate)}`}</h5>
        <h6>Period B</h6>
      </div>
    </div>
  );
};

DotGridPeriodsHeader.propTypes = {
  dateRanges: pt.dateRanges.isRequired,
};

export default DotGridPeriodsHeader;
