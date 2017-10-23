import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
  referenceEntityValuesFilteredSelector,
} from '../common/reduxSelectors';

import LineChart from '../components/LineChart';

const mapStateToProps = (state, props) => {
  const { browser, entities } = state;
  const { height, width } = browser;
  const dateRange = dateRangesSelector(state, props);

  return {
    appHeight: height,
    appWidth: width,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    keyPrimary: entities.primary.key,
    keySecondary: entities.secondary.key,
    keyReference: entities.reference,
    primaryValues: primaryEntityValuesFilteredSelector(state, props),
    secondaryValues: secondaryEntityValuesFilteredSelector(state, props),
    referenceValues: referenceEntityValuesFilteredSelector(state, props),
    yMax: props.yMax, // this is created on the component instance (see LineChartsContainer)
    y2Max: props.y2Max, // this is created on the component instance (see LineChartsContainer)
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
    } = nextProps;
    const { period, setMaxY } = this.props; // these remain consistent so don't need to be diff'd

    // set max y domain values after state change
    if (
      keyPrimary !== this.props.keyPrimary ||
      keySecondary !== this.props.keySecondary ||
      startDate !== this.props.startDate ||
      endDate !== this.props.endDate ||
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
      (referenceValues.length && !this.props.referenceValues.length)
    ) {
      setMaxY(`${period}Y2`, referenceValues);
    }
  }

  render() {
    const {
      appHeight,
      appWidth,
      primaryValues,
      secondaryValues,
      referenceValues,
      keyPrimary,
      keySecondary,
      keyReference,
      startDate,
      endDate,
      yMax,
      y2Max,
    } = this.props;

    return (
      <div className="LineChartWrapper">
        {this.props.children}
        <LineChart
          appHeight={appHeight}
          appWidth={appWidth}
          keyPrimary={keyPrimary}
          keySecondary={keySecondary}
          keyReference={keyReference}
          primaryValues={primaryValues}
          secondaryValues={secondaryValues}
          referenceValues={referenceValues}
          primaryColor="#393B79"
          secondaryColor="#843C39"
          referenceColor="#e2e2e2"
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
  keyPrimary: pt.key,
  keySecondary: pt.key,
  keyReference: pt.key,
  primaryValues: PropTypes.arrayOf(PropTypes.object),
  secondaryValues: PropTypes.arrayOf(PropTypes.object),
  referenceValues: PropTypes.arrayOf(PropTypes.object),
  startDate: pt.date.isRequired,
  endDate: pt.date.isRequired,
  yMax: PropTypes.number,
  y2Max: PropTypes.number,
  setMaxY: PropTypes.func.isRequired,
};

LineChartWrapper.defaultProps = {
  children: null,
  keyPrimary: '',
  keySecondary: '',
  keyReference: '',
  primaryValues: [],
  secondaryValues: [],
  referenceValues: [],
  yMax: null,
  y2Max: null,
};

export default connect(mapStateToProps, null)(LineChartWrapper);
