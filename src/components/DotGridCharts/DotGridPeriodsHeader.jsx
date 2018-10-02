import React from 'react';
import { timeFormat } from 'd3';

import * as pt from '../../common/reactPropTypeDefs';
import { findDateDiffInMonths } from '../../common/d3Utils';

const DotGridPeriodsHeader = props => {
  const { period1, period2 } = props.dateRanges;
  const formatTime = timeFormat('%b %Y');

  const howmanymonths1 = findDateDiffInMonths(period1.startDate, period1.endDate);
  const monthsword1 = howmanymonths1 > 1 ? 'months' : 'month';

  const howmanymonths2 = findDateDiffInMonths(period2.startDate, period2.endDate);
  const monthsword2 = howmanymonths2 > 1 ? 'months' : 'month';

  return (
    <div className="dot-grid-row">
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatTime(period1.startDate)} – ${formatTime(period1.endDate)}`}</h5>
        <h6>
          Period A ({howmanymonths1} {monthsword1})
        </h6>
      </div>
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatTime(period2.startDate)} – ${formatTime(period2.endDate)}`}</h5>
        <h6>
          Period B ({howmanymonths2} {monthsword2})
        </h6>
      </div>
    </div>
  );
};

DotGridPeriodsHeader.propTypes = {
  dateRanges: pt.dateRanges.isRequired,
};

export default DotGridPeriodsHeader;
