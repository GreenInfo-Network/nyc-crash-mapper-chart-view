import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';

const DotGridTitle = props => {
  const { keyLabel } = props;

  return (
    <div className="DotGridTitle">
      <h5>{keyLabel}</h5>
    </div>
  );
};

DotGridTitle.propTypes = {
  dateRanges: pt.dateRanges.isRequired,
  entityLabel: PropTypes.string.isRequired,
  keyLabel: PropTypes.string.isRequired,
};

export default DotGridTitle;
