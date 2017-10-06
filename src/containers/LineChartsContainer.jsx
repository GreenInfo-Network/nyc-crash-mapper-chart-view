import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { max } from 'd3';

import * as pt from '../common/reactPropTypeDefs';
import { formatDate } from '../common/d3Utils';
import mapFilterTypesToProps, { filterValuesByDateRange } from '../common/utils';
import { filterEntitiesValues } from '../reducers';
import LineChart from '../components/LineChart';

/**
 * Connected Component that houses the D3 Line Charts
 */
class LineChartsContainer extends Component {
  static propTypes = {
    appHeight: PropTypes.number.isRequired,
    appWidth: PropTypes.number.isRequired,
    primary: pt.entity.isRequired,
    secondary: pt.entity.isRequired,
    nested: PropTypes.arrayOf(PropTypes.object),
    citywidePeriod1: PropTypes.arrayOf(PropTypes.object),
    citywidePeriod2: PropTypes.arrayOf(PropTypes.object),
    dateRangeTwo: pt.dateRange,
    dateRangeOne: pt.dateRange,
    valuesDateRange1: pt.valuesByDateRange.isRequired,
    valuesDateRange2: pt.valuesByDateRange.isRequired,
  };

  static defaultProps = {
    nested: [],
    citywidePeriod1: [],
    citywidePeriod2: [],
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  render() {
    const {
      appHeight,
      appWidth,
      citywidePeriod1,
      citywidePeriod2,
      nested,
      primary,
      secondary,
      dateRangeOne,
      dateRangeTwo,
      valuesDateRange1,
      valuesDateRange2,
    } = this.props;

    const style = {
      height: '100%',
      width: '100%',
    };

    // both line charts should share the same y domain for entities & citywide
    // compute the max value of each here then pass it down
    const y = [
      ...valuesDateRange1.primary.values,
      ...valuesDateRange1.secondary.values,
      ...valuesDateRange2.primary.values,
      ...valuesDateRange2.secondary.values,
    ];

    const y2 = [...citywidePeriod1, ...citywidePeriod2];

    const entitiesMax = max(y, d => d.count);
    const citywideMax = max(y2, d => d.count);

    return (
      <div className="LineChartsContainer" style={style}>
        <div className="chart-container">
          <h6>Period Two</h6>
          <h6>
            {formatDate(dateRangeTwo.startDate)} — {formatDate(dateRangeTwo.endDate)}
          </h6>
          <LineChart
            appHeight={appHeight}
            appWidth={appWidth}
            citywide={citywidePeriod2}
            yMax={entitiesMax}
            y2Max={citywideMax}
            nested={nested}
            keyPrimary={primary.key}
            keySecondary={secondary.key}
            {...dateRangeTwo}
            valuesByDateRange={valuesDateRange2}
          />
        </div>
        <div className="chart-container">
          <h6>Period One</h6>
          <h6>
            {formatDate(dateRangeOne.startDate)} — {formatDate(dateRangeOne.endDate)}
          </h6>
          <LineChart
            appHeight={appHeight}
            appWidth={appWidth}
            citywide={citywidePeriod1}
            yMax={entitiesMax}
            y2Max={citywideMax}
            nested={nested}
            keyPrimary={primary.key}
            keySecondary={secondary.key}
            {...dateRangeOne}
            valuesByDateRange={valuesDateRange1}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, data, entities, filterType, dateRanges } = state;
  // NOTE: the values stored in primary and secondary entities ARE NOT FILTERED,
  // they need to be filtered prior to being passed to the line charts
  const { height, width } = browser;
  const { citywide } = data;
  const { primary, secondary } = entities;
  const { group1, group2 } = dateRanges;

  // filter primary and secondary entity data by date ranges
  const { valuesDateRange1, valuesDateRange2 } = filterEntitiesValues(state);

  // citywide data which always(?) shows up on the line chart
  const citywideValues = citywide.response || [];
  const citywidePeriod1 = mapFilterTypesToProps(
    filterType,
    filterValuesByDateRange(citywideValues, group1.startDate, group1.endDate)
  );
  const citywidePeriod2 = mapFilterTypesToProps(
    filterType,
    filterValuesByDateRange(citywideValues, group2.startDate, group2.endDate)
  );

  return {
    appHeight: height,
    appWidth: width,
    citywidePeriod1,
    citywidePeriod2,
    primary,
    secondary,
    dateRangeOne: group1,
    dateRangeTwo: group2,
    valuesDateRange1,
    valuesDateRange2,
  };
};

export default connect(mapStateToProps, null)(LineChartsContainer);
