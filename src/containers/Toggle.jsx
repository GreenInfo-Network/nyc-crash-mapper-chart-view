import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as pt from '../common/reactPropTypeDefs';

import { toggleTrendCompare } from '../actions';

const mapStateToProps = ({ trendCompare }) => ({ trendCompare });

const Toggle = props => {
  // eslint-disable-next-line
  const { toggleTrendCompare, trendCompare } = props;
  const { trend, compare } = trendCompare;
  return (
    <div className="Toggle">
      <button
        className={trend ? 'active' : null}
        onClick={() => (!trend ? toggleTrendCompare() : null)}
      >
        Trend
      </button>
      <button
        className={compare ? 'active' : null}
        onClick={() => (!compare ? toggleTrendCompare() : null)}
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
