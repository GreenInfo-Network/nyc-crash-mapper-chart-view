import React, { Component } from 'react';
import { connect } from 'react-redux';
import { max } from 'd3';

import * as pt from '../common/reactPropTypeDefs';

import LineChartWrapper from './LineChartWrapper';
import LineChartTitle from '../components/LineChartTitle';
import ReferenceEntitySelect from './ReferenceEntitySelect';

/**
 * Class that is a connected component which houses the the Line Charts
 * Uses internal state to track entity values & compute max y so that both charts share the same y domains
 */
class LineChartsContainer extends Component {
  static propTypes = {
    dateRangeTwo: pt.dateRange.isRequired,
    dateRangeOne: pt.dateRange.isRequired,
  };

  constructor() {
    super();
    this.state = {
      period1Y: [],
      period2Y: [],
      period1Y2: [],
      period2Y2: [],
    };
    this.setPeriodYValue = this.setPeriodYValue.bind(this);
  }

  setPeriodYValue(type, values) {
    if (values && values.length) {
      this.setState({
        [type]: values,
      });
    }
  }

  render() {
    const { period1Y, period2Y, period1Y2, period2Y2 } = this.state;
    const { dateRangeOne, dateRangeTwo } = this.props;

    const style = {
      height: '100%',
      width: '100%',
    };

    // both line charts should share the same y domain for primary secondary & reference,
    // so compute the max value of each here then pass it down to the charts
    const y = [...period1Y, ...period2Y];
    const y2 = [...period1Y2, ...period2Y2];

    const entitiesMax = max(y, d => d.count);
    const citywideMax = max(y2, d => d.count);

    return (
      <div className="LineChartsContainer scroll" style={style}>
        <LineChartWrapper
          period="period1"
          yMax={entitiesMax}
          y2Max={citywideMax}
          setMaxY={this.setPeriodYValue}
        >
          <LineChartTitle
            title={'Period One'}
            startDate={dateRangeOne.startDate}
            endDate={dateRangeOne.endDate}
          >
            <ReferenceEntitySelect />
          </LineChartTitle>
        </LineChartWrapper>
        <LineChartWrapper
          period="period2"
          yMax={entitiesMax}
          y2Max={citywideMax}
          setMaxY={this.setPeriodYValue}
        >
          <LineChartTitle
            title={'Period One'}
            startDate={dateRangeTwo.startDate}
            endDate={dateRangeTwo.endDate}
          />
        </LineChartWrapper>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { dateRanges } = state;
  const { period1, period2 } = dateRanges;

  return {
    dateRangeOne: period1,
    dateRangeTwo: period2,
  };
};

export default connect(mapStateToProps, null)(LineChartsContainer);
