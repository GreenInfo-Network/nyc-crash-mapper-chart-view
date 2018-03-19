import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatNumber } from '../common/d3Utils';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,  // eslint-disable-line
  secondaryEntityValuesFilteredSelector,  // eslint-disable-line
  customGeographyValuesFilteredSelector,  // eslint-disable-line
} from '../common/reduxSelectors';

const mapStateToProps = (state, props) => {
  const { filterType } = state;
  const { entityType, period } = props;
  const dateRange = dateRangesSelector(state, props);

  let values = [];
  switch (entityType) {
    case 'primary':
      values = primaryEntityValuesFilteredSelector(state, props);
      break;
    case 'secondary':
      values = secondaryEntityValuesFilteredSelector(state, props);
      break;
    case 'custom':
      values = customGeographyValuesFilteredSelector(state, props);
      break;
    default:
      throw new Error('DotGridSums got unexpected entityType');
  }

  const totalinjured = values.reduce(
    (sum, month) => sum + month.pedestrian_injured + month.cyclist_injured + month.motorist_injured,
    0
  );
  const totalkilled = values.reduce(
    (sum, month) => sum + month.pedestrian_killed + month.cyclist_killed + month.motorist_killed,
    0
  );

  return {
    filterType,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    period,
    entityType,
    totalinjured,
    totalkilled,
  };
};

/*
 * Class that wraps the Dot Grid Chart connecting it to parts of the Redux Store
 * Unlike the Line Charts, each Dot Grid Chart gets a single geo entity, time period, and person type
*/
class DotGridSums extends Component {
  static propTypes = {
    entityType: pt.key.isRequired,
    filterType: pt.filterType.isRequired,
    period: PropTypes.string.isRequired,
    startDate: pt.date.isRequired,
    endDate: pt.date.isRequired,
    totalinjured: PropTypes.number.isRequired,
    totalkilled: PropTypes.number.isRequired,
  };

  static defaultProps = {
    values: [],
  };

  render() {
    const { totalinjured, totalkilled } = this.props;

    return (
      <div className="DotGridSums">
        <h6>
          persons killed: {formatNumber(totalkilled)}
          <br />
          persons injured: {formatNumber(totalinjured)}
        </h6>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridSums);
