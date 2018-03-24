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

  // surprise in issue 99: they want to calculate BOTH sets of stats,
  // so that if this is period1 it can report a %diff from period2
  // this doubles the amount of recalculation at every step
  const otherperiod = period === 'period1' ? 'period2' : 'period1';
  const otherprops = { ...props, period: otherperiod };

  let others = [];
  let values = [];
  switch (entityType) {
    case 'primary':
      values = primaryEntityValuesFilteredSelector(state, props);
      others = primaryEntityValuesFilteredSelector(state, otherprops);
      break;
    case 'secondary':
      values = secondaryEntityValuesFilteredSelector(state, props);
      others = secondaryEntityValuesFilteredSelector(state, otherprops);
      break;
    case 'citywide':
      values = referenceEntityValuesFilteredSelector(state, props);
      others = referenceEntityValuesFilteredSelector(state, otherprops);
      break;
    case 'custom':
      values = customGeographyValuesFilteredSelector(state, props);
      others = customGeographyValuesFilteredSelector(state, otherprops);
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

  const otherinjured = others.reduce((sum, month) => {
    let newadds = 0;
    if (month.pedestrian_injured !== undefined) newadds += month.pedestrian_injured;
    if (month.cyclist_injured !== undefined) newadds += month.cyclist_injured;
    if (month.motorist_injured !== undefined) newadds += month.motorist_injured;
    return sum + newadds;
  }, 0);
  const otherkilled = others.reduce((sum, month) => {
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
    otherinjured,
    otherkilled,
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
    otherinjured: PropTypes.number.isRequired,
    otherkilled: PropTypes.number.isRequired,
  };

  static defaultProps = {
    values: [],
    otherinjured: undefined,
    otherkilled: undefined,
  };

  render() {
    const { totalinjured, totalkilled } = this.props;
    const { otherinjured, otherkilled } = this.props;
    const { period } = this.props;

    // issue 99: for Period A (aka period1)
    // calculate %diffs from our injury/kill counts relative to that "other" period
    const pctdiffkill = 100 * (otherkilled - totalkilled) / otherkilled;
    const pctdiffinjr = 100 * (otherinjured - totalinjured) / otherinjured;

    let difftextkill = '';
    let difftextinjr = '';
    if (period === 'period1') {
      difftextkill = otherkilled === totalkilled ? 'no change' : '<1% change';
      difftextinjr = otherinjured === totalinjured ? 'no change' : '<1% change';

      if (Math.abs(pctdiffkill) >= 1.0) {
        const sign = pctdiffinjr > 0 ? '+' : '-';
        const number = Math.round(Math.abs(pctdiffkill)).toFixed(0);
        difftextkill = `${sign}${number}% change`;
      }
      if (Math.abs(pctdiffinjr) >= 1.0) {
        const sign = pctdiffkill > 0 ? '+' : '-';
        const number = Math.round(Math.abs(pctdiffinjr)).toFixed(0);
        difftextinjr = `${sign}${number}% change`;
      }
    }

    return (
      <div className="DotGridSums">
        <h6>
          {formatNumber(totalkilled)} killed
          <br />
          {difftextkill}
        </h6>
        <h6>
          {formatNumber(totalinjured)} injured
          <br />
          {difftextinjr}
        </h6>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridSums);
