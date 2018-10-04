import React, { Component } from 'react';
import { max } from 'd3';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { setDateRangeGroupOne, setDateRangeGroupTwo } from '../../actions';

import LineChartWrapper from '../../containers/LineChartWrapper';
import ReferenceEntitySelect from '../../containers/ReferenceEntitySelect';
import { formatDateMonth, findDateDiffInMonths } from '../../common/d3Utils';

const mapStateToProps = ({ dateRanges }) => ({
  periodA: dateRanges.period1,
  periodB: dateRanges.period2,
});

/**
 * Class that houses the the Line Charts
 * Uses internal state to track entity values & compute max y values for primary & secondary entities
   and reference entity, so that both charts share the same y domains
 */
class LineChartsContainer extends Component {
  static propTypes = {
    periodA: PropTypes.shape({
      endDate: PropTypes.instanceOf(Date),
      startDate: PropTypes.instanceOf(Date),
    }),
    periodB: PropTypes.shape({
      endDate: PropTypes.instanceOf(Date),
      startDate: PropTypes.instanceOf(Date),
    }),
  };

  static defaultProps = {
    periodA: {},
    periodB: {},
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
    const { periodA, periodB } = this.props;

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

    // inspect the period A and B date ranges
    // make a warning message if they're of different duration and/or months
    let howmanymonthsA = 0;
    let howmanymonthsB = 0;
    let startmonthA = '';
    let startmonthB = '';
    let periodsequalwarning = null;

    if (periodA && periodB) {
      howmanymonthsA = findDateDiffInMonths(periodA.startDate, periodA.endDate);
      howmanymonthsB = findDateDiffInMonths(periodB.startDate, periodB.endDate);
      startmonthA = formatDateMonth(periodA.startDate);
      startmonthB = formatDateMonth(periodB.startDate);
    }

    if (howmanymonthsA !== howmanymonthsB) {
      periodsequalwarning = (
        <div className="PeriodsNotEqualWarning">
          It's best to select two periods of the same duration.
        </div>
      );
    } else if (startmonthA !== startmonthB) {
      periodsequalwarning = (
        <div className="PeriodsNotEqualWarning">
          It's best to select two periods of the same months.
        </div>
      );
    }

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
        {periodsequalwarning}
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

export default connect(mapStateToProps, {
  setDateRangeGroupOne,
  setDateRangeGroupTwo,
})(LineChartsContainer);
