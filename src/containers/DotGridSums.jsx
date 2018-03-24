import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { formatNumber } from '../common/d3Utils';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
  customGeographyValuesFilteredSelector,
  referenceEntityValuesFilteredSelector,
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
    case 'citywide':
      values = referenceEntityValuesFilteredSelector(state, props);
      break;
    case 'custom':
      values = customGeographyValuesFilteredSelector(state, props);
      break;
    default:
      throw new Error('DotGridSums got unexpected entityType');
  }

  const totalinjured = values.reduce((sum, month) => {
    let newadds = 0;
    if (month.pedestrian_injured !== undefined) newadds += month.pedestrian_injured;
    if (month.cyclist_injured !== undefined) newadds += month.cyclist_injured;
    if (month.motorist_injured !== undefined) newadds += month.motorist_injured;
    return sum + newadds;
  }, 0);
  const totalkilled = values.reduce((sum, month) => {
    let newadds = 0;
    if (month.pedestrian_killed !== undefined) newadds += month.pedestrian_killed;
    if (month.cyclist_killed !== undefined) newadds += month.cyclist_killed;
    if (month.motorist_killed !== undefined) newadds += month.motorist_killed;
    return sum + newadds;
  }, 0);

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
        <h6>{formatNumber(totalkilled)} killed</h6>
        <h6>{formatNumber(totalinjured)} injured</h6>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridSums);
