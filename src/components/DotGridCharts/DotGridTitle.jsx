import React from 'react';
import PropTypes from 'prop-types';
import { timeFormat } from 'd3';

import * as pt from '../../common/reactPropTypeDefs';

const DotGridTitle = props => {
  const { keyPrimary, entityLabel, dateRanges } = props;
  const { period1, period2 } = dateRanges;
  const formatTime = timeFormat('%b %Y');

  return (
    <div className="DotGridTitle">
      <h5>{`${entityLabel} ${keyPrimary}`}</h5>
      <div className="date-ranges">
        <div>
          <h6 className="period">Period One</h6>
          <h6 className="date-range">
            {`${formatTime(period1.startDate)} – ${formatTime(period1.endDate)}`}
          </h6>
        </div>
        <div>
          <h6 className="period">Period Two</h6>
          <h6 className="date-range">
            {`${formatTime(period2.startDate)} – ${formatTime(period2.endDate)}`}
          </h6>
        </div>
      </div>
    </div>
  );
};

DotGridTitle.propTypes = {
  keyPrimary: pt.key.isRequired,
  dateRanges: pt.dateRanges.isRequired,
  entityLabel: PropTypes.string.isRequired,
};

export default DotGridTitle;
