import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { max } from 'd3';
import { connect } from 'react-redux';

import { setTrendAggregation, setDateRangeGroupOne, setDateRangeGroupTwo } from '../../actions';

import LineChartWrapper from '../../containers/LineChartWrapper';
import ReferenceEntitySelect from '../../containers/ReferenceEntitySelect';
import { formatDateMonth } from '../../common/d3Utils';

const mapStateToProps = ({ dateRanges, trendAggMonths }) => ({
  periodA: dateRanges.period1,
  periodB: dateRanges.period2,
  trendAggMonths,
});

/**
 * Class that houses the the Line Charts
 * Uses internal state to track entity values & compute max y values for primary & secondary entities
   and reference entity, so that both charts share the same y domains
 */
class LineChartsContainer extends Component {
  static propTypes = {
    trendAggMonths: PropTypes.number.isRequired,
    setTrendAggregation: PropTypes.func.isRequired,
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
    this.handleChangeAggMonths = this.handleChangeAggMonths.bind(this);
  }

  setPeriodYValue(type, values) {
    if (values && values.length) {
      this.setState({
        [type]: values,
      });
    }
  }

  handleChangeAggMonths(event) {
    const months = parseInt(event.target.value, 10);
    this.props.setTrendAggregation(months);
  }

  render() {
    const { period1Y, period2Y, period1Y2, period2Y2 } = this.state;
    const { trendAggMonths } = this.props;
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

    const xaxisselector = (
      <span className="TrendMonthsAggSelector">
        <label htmlFor="trend-months-agg-selector">AGGREGATE EVERY</label>
        <select
          id="trend-months-agg-selector"
          value={trendAggMonths}
          onChange={this.handleChangeAggMonths}
        >
          <option value="1">Month</option>
          <option value="3">3 Months</option>
          <option value="6">6 Months</option>
          <option value="12">12 Months</option>
        </select>
      </span>
    );

    // inspect the period A and B date ranges
    // make a warning message if they're of different duration and/or months
    let startmonthA = '';
    let startmonthB = '';
    let periodsequalwarning = null;

    if (periodA && periodB) {
      startmonthA = formatDateMonth(periodA.startDate);
      startmonthB = formatDateMonth(periodB.startDate);
    }

    if (startmonthA !== startmonthB) {
      periodsequalwarning = (
        <div className="PeriodsNotEqualWarning">
          It's best to select two periods starting in the same month.
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
          trendAggMonths={parseInt(trendAggMonths, 10)}
        >
          {xaxisselector}
          <ReferenceEntitySelect />
        </LineChartWrapper>
        {periodsequalwarning}
        <LineChartWrapper
          period="period2"
          yMax={entitiesMax}
          y2Max={citywideMax}
          setMaxY={this.setPeriodYValue}
          trendAggMonths={parseInt(trendAggMonths, 10)}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  setTrendAggregation,
  setDateRangeGroupOne,
  setDateRangeGroupTwo,
})(LineChartsContainer);
