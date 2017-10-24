import React, { Component } from 'react';
import { max } from 'd3';

import LineChartWrapper from '../../containers/LineChartWrapper';
import ReferenceEntitySelect from '../../containers/ReferenceEntitySelect';

/**
 * Class that houses the the Line Charts
 * Uses internal state to track entity values & compute max y values for primary & secondary entities
   and reference entity, so that both charts share the same y domains
 */
class LineChartsContainer extends Component {
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
          <ReferenceEntitySelect />
        </LineChartWrapper>
        <LineChartWrapper
          period="period2"
          yMax={entitiesMax}
          y2Max={citywideMax}
          setMaxY={this.setPeriodYValue}
        />
      </div>
    );
  }
}

export default LineChartsContainer;
