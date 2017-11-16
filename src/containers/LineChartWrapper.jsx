import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import isEqual from 'lodash/isEqual';

import styleVars from '../common/styleVars';
import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
  referenceEntityValuesFilteredSelector,
  primaryAllDatesSelector,
  secondaryAllDatesSelector,
  referenceAllDatesSelector,
} from '../common/reduxSelectors';

import LineChart from '../components/LineCharts/LineChart';
import LineChartTitle from '../components/LineCharts/LineChartTitle';

const mapStateToProps = (state, props) => {
  const { browser, entities, filterType } = state;
  const { height, width } = browser;
  const dateRange = dateRangesSelector(state, props);

  return {
    appHeight: height,
    appWidth: width,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    entityType: entities.entityType,
    keyPrimary: entities.primary.key,
    keySecondary: entities.secondary.key,
    keyReference: entities.reference,
    // some data overlap going on here that could probably be avoided given more time for refactoring
    // although using the memozied selectors should help cut down on the amount of data processing
    primaryValues: primaryEntityValuesFilteredSelector(state, props),
    secondaryValues: secondaryEntityValuesFilteredSelector(state, props),
    referenceValues: referenceEntityValuesFilteredSelector(state, props),
    primaryAllDates: primaryAllDatesSelector(state, props),
    secondaryAllDates: secondaryAllDatesSelector(state, props),
    referenceAllDates: referenceAllDatesSelector(state, props),
    colorPrimary: entities.primary.color,
    colorSecondary: entities.secondary.color,
    yMax: props.yMax, // this is created on the component instance (see LineChartsContainer)
    y2Max: props.y2Max, // this is created on the component instance (see LineChartsContainer),
    filterType,
  };
};

/**
  * class that connects the line chart component to the Redux Store
  * so that the chart can be passed filtered data for primary, secondary, & reference entities
*/
class LineChartWrapper extends Component {
  componentDidMount() {
    const {
      keyPrimary,
      keySecondary,
      keyReference,
      primaryValues,
      secondaryValues,
      referenceValues,
      period,
      setMaxY,
    } = this.props;

    // set max y domain values after user toggled chart type
    if ((keyPrimary && primaryValues.length) || (keySecondary && secondaryValues.length)) {
      setMaxY(`${period}Y`, [...primaryValues, ...secondaryValues]);
    }

    // set max y2 domain values after user toggled chart type
    if (keyReference && referenceValues.length) {
      setMaxY(`${period}Y2`, referenceValues);
    }
  }

  componentWillReceiveProps(nextProps) {
    const {
      keyPrimary,
      keySecondary,
      keyReference,
      primaryValues,
      secondaryValues,
      referenceValues,
      startDate,
      endDate,
      filterType,
    } = nextProps;
    const { period, setMaxY } = this.props; // these remain consistent so don't need to be diff'd

    // set max y domain values after state change
    if (
      keyPrimary !== this.props.keyPrimary ||
      keySecondary !== this.props.keySecondary ||
      startDate !== this.props.startDate ||
      endDate !== this.props.endDate ||
      !isEqual(filterType, this.props.filterType) ||
      (primaryValues.length && !this.props.primaryValues.length) ||
      (secondaryValues.length && !this.props.secondaryValues.length)
    ) {
      setMaxY(`${period}Y`, [...primaryValues, ...secondaryValues]);
    }

    // set max y2 domain values after state change
    if (
      keyReference !== this.props.keyReference ||
      startDate !== this.props.startDate ||
      endDate !== this.props.endDate ||
      !isEqual(filterType, this.props.filterType) ||
      (referenceValues.length && !this.props.referenceValues.length)
    ) {
      setMaxY(`${period}Y2`, referenceValues);
    }
  }

  render() {
    const {
      appHeight,
      appWidth,
      children,
      period,
      entityType,
      primaryAllDates,
      secondaryAllDates,
      referenceAllDates,
      keyPrimary,
      keySecondary,
      keyReference,
      colorPrimary,
      colorSecondary,
      startDate,
      endDate,
      yMax,
      y2Max,
    } = this.props;

    const titleText = period === 'period1' ? 'Period A' : 'Period B';

    return (
      <div className="LineChartWrapper">
        <LineChartTitle title={titleText} startDate={startDate} endDate={endDate}>
          {children}
        </LineChartTitle>
        <LineChart
          appHeight={appHeight}
          appWidth={appWidth}
          period={period}
          entityType={entityType}
          keyPrimary={keyPrimary}
          keySecondary={keySecondary}
          keyReference={keyReference}
          primaryValues={primaryAllDates}
          secondaryValues={secondaryAllDates}
          referenceValues={referenceAllDates}
          primaryColor={colorPrimary}
          secondaryColor={colorSecondary}
          referenceColor={styleVars['reference-color']}
          startDate={startDate}
          endDate={endDate}
          yMax={yMax}
          y2Max={y2Max}
        />
      </div>
    );
  }
}

LineChartWrapper.propTypes = {
  appHeight: PropTypes.number.isRequired,
  appWidth: PropTypes.number.isRequired,
  children: PropTypes.element,
  period: PropTypes.string.isRequired,
  entityType: PropTypes.string,
  keyPrimary: pt.key,
  keySecondary: pt.key,
  keyReference: pt.key,
  primaryValues: PropTypes.arrayOf(PropTypes.object),
  secondaryValues: PropTypes.arrayOf(PropTypes.object),
  referenceValues: PropTypes.arrayOf(PropTypes.object),
  primaryAllDates: PropTypes.arrayOf(PropTypes.object),
  secondaryAllDates: PropTypes.arrayOf(PropTypes.object),
  referenceAllDates: PropTypes.arrayOf(PropTypes.object),
  colorPrimary: PropTypes.string.isRequired,
  colorSecondary: PropTypes.string.isRequired,
  startDate: pt.date.isRequired,
  endDate: pt.date.isRequired,
  yMax: PropTypes.number,
  y2Max: PropTypes.number,
  setMaxY: PropTypes.func.isRequired,
  filterType: pt.filterType.isRequired,
};

LineChartWrapper.defaultProps = {
  children: null,
  entityType: '',
  keyPrimary: '',
  keySecondary: '',
  keyReference: '',
  primaryValues: [],
  secondaryValues: [],
  referenceValues: [],
  primaryAllDates: [],
  secondaryAllDates: [],
  referenceAllDates: [],
  yMax: null,
  y2Max: null,
};

export default connect(mapStateToProps, null)(LineChartWrapper);
