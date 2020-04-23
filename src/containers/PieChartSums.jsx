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
  const { entityType, period, damageType } = props;
  const dateRange = dateRangesSelector(state, props);

  // surprise in issue 99: they want to calculate BOTH sets of stats,
  // so that if this is period1 it can report a %diff from period2
  // this doubles the amount of recalculation at every step

  // issue 99: we want to report citywide, and it may not be our reference entity
  // in fact, if custom geography exists it is presumed to be the reference entity
  // so, override this into a custom state object to force citywide stats
  // we declare it here even if we don't use it, cuz lint won't let us declare it in the switch
  const citywidestate = { ...state };
  citywidestate.entities.reference = 'citywide';

  let values = [];
  switch (entityType) {
    case 'primary':
      values = primaryEntityValuesFilteredSelector(state, props);
      break;
    case 'secondary':
      values = secondaryEntityValuesFilteredSelector(state, props);
      break;
    case 'citywide':
      values = referenceEntityValuesFilteredSelector(citywidestate, props);
      break;
    case 'custom':
      values = customGeographyValuesFilteredSelector(state, props);
      break;
    default:
      throw new Error('pieChartSums got unexpected entityType');
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
    damageType,
  };
};

/*
 * Class that wraps the Dot Grid Chart connecting it to parts of the Redux Store
 * Unlike the Line Charts, each Dot Grid Chart gets a single geo entity, time period, and person type
 */
class PieChartSums extends Component {
  static propTypes = {
    entityType: pt.key.isRequired,
    filterType: pt.filterType.isRequired,
    period: PropTypes.string.isRequired,
    startDate: pt.date.isRequired,
    endDate: pt.date.isRequired,
    totalinjured: PropTypes.number.isRequired,
    totalkilled: PropTypes.number.isRequired,
    damageType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    values: [],
  };

  render() {
    const { totalinjured, totalkilled } = this.props;
    const injured = this.props.damageType === 'injured';

    return (
      <div className="pieChartSums">
        {injured ? (
          <h6>INJURIES {formatNumber(totalinjured)}</h6>
        ) : (
          <h6>DEATHS {formatNumber(totalkilled)}</h6>
        )}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(PieChartSums);
