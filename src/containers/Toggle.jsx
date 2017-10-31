import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as pt from '../common/reactPropTypeDefs';

import { toggleTrendCompare } from '../actions';

const mapStateToProps = ({ trendCompare }) => ({ trendCompare });

const Toggle = props => {
  // eslint-disable-next-line
  const { toggleTrendCompare, trendCompare } = props;
  return (
    <div className="Toggle">
      <button
        className={trendCompare === 'trend' ? 'active' : null}
        onClick={() => (trendCompare !== 'trend' ? toggleTrendCompare('trend') : null)}
      >
        Trend
      </button>
      <button
        className={trendCompare === 'compare' ? 'active' : null}
        onClick={() => (trendCompare !== 'compare' ? toggleTrendCompare('compare') : null)}
      >
        Compare
      </button>
    </div>
  );
};

Toggle.propTypes = {
  toggleTrendCompare: PropTypes.func.isRequired,
  trendCompare: pt.trendCompare.isRequired,
};

export default connect(mapStateToProps, { toggleTrendCompare })(Toggle);
