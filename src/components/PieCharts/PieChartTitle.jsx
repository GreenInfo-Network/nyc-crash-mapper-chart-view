import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';

const PieChartTitle = props => {
  const { keyLabel } = props;

  return (
    <div className="PieChartTitle">
      <h6>{keyLabel}</h6>
    </div>
  );
};

PieChartTitle.propTypes = {
  dateRanges: pt.dateRanges.isRequired,
  entityLabel: PropTypes.string.isRequired,
  keyLabel: PropTypes.string.isRequired,
};

export default PieChartTitle;
