import React from 'react';

import * as pt from '../../common/reactPropTypeDefs';
import { findDateDiffInMonths, formatDate, formatDateMonth } from '../../common/d3Utils';

const DotGridPeriodsHeader = props => {
  const { period1, period2 } = props.dateRanges;

  const startmonth1 = formatDateMonth(period1.startDate);
  const startmonth2 = formatDateMonth(period2.startDate);

  const howmanymonths1 = findDateDiffInMonths(period1.startDate, period1.endDate);
  const monthsword1 = howmanymonths1 > 1 ? 'months' : 'month';

  const howmanymonths2 = findDateDiffInMonths(period2.startDate, period2.endDate);
  const monthsword2 = howmanymonths2 > 1 ? 'months' : 'month';

  let periodsequalwarning = null;
  if (howmanymonths1 !== howmanymonths2 || startmonth1 !== startmonth2) {
    periodsequalwarning = (
      <h6 className="PeriodsNotEqualWarning">
        Select two periods with same start month and duration.
      </h6>
    );
  }

  return (
    <div className="dot-grid-row">
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatDate(period1.startDate)} – ${formatDate(period1.endDate)}`}</h5>
        <h6>
          Period A &nbsp;
          <span>
            ({howmanymonths1} {monthsword1})
          </span>
        </h6>
        {periodsequalwarning}
      </div>
      <div className="DotGridPeriodsHeader">
        <h5>{`${formatDate(period2.startDate)} – ${formatDate(period2.endDate)}`}</h5>
        <h6>
          Period B &nbsp;
          <span>
            ({howmanymonths2} {monthsword2})
          </span>
        </h6>
        {periodsequalwarning}
      </div>
    </div>
  );
};

DotGridPeriodsHeader.propTypes = {
  dateRanges: pt.dateRanges.isRequired,
};

export default DotGridPeriodsHeader;
