import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import cloneDeep from 'lodash/cloneDeep';
import isEqual from 'lodash/isEqual';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
  customGeographyValuesFilteredSelector,
  referenceEntityValuesFilteredSelector,
} from '../common/reduxSelectors';
import BarChart from '../components/PieCharts/BarChart';
import PieChart from '../components/PieCharts/PieChart';

const calcTotal = (values, damageType) => {
  if (damageType === 'injured') {
    const totalinjured = values.reduce((sum, month) => {
      let newadds = 0;
      if (month.pedestrian_injured !== undefined) newadds += month.pedestrian_injured;
      if (month.cyclist_injured !== undefined) newadds += month.cyclist_injured;
      if (month.motorist_injured !== undefined) newadds += month.motorist_injured;
      return sum + newadds;
    }, 0);
    return totalinjured;
  }
  const totalkilled = values.reduce((sum, month) => {
    let newadds = 0;
    if (month.pedestrian_killed !== undefined) newadds += month.pedestrian_killed;
    if (month.cyclist_killed !== undefined) newadds += month.cyclist_killed;
    if (month.motorist_killed !== undefined) newadds += month.motorist_killed;
    return sum + newadds;
  }, 0);
  return totalkilled;
};

const mapStateToProps = (state, props) => {
  const { browser, filterType } = state;
  const { entityType, period, damageType } = props;
  const dateRange = dateRangesSelector(state, props);

  const allValues = {
    period1: [],
    period2: [],
  };
  ['period1', 'period2'].forEach(p => {
    let values = [];
    const newProps = { ...props, period: p };
    switch (entityType) {
      case 'primary':
        values = primaryEntityValuesFilteredSelector(state, newProps);
        break;
      case 'secondary':
        values = secondaryEntityValuesFilteredSelector(state, newProps);
        break;
      case 'citywide':
        values = referenceEntityValuesFilteredSelector(state, newProps);
        break;
      case 'custom':
        values = customGeographyValuesFilteredSelector(state, newProps);
        break;
      default:
        throw new Error('DotGridWrapper got unexpected entityType');
    }
    allValues[p] = values;
  });
  const totals = {
    period1: calcTotal(allValues.period1, damageType),
    period2: calcTotal(allValues.period2, damageType),
  };
  const maxTotal = Math.max(totals.period1, totals.period2);
  const currentTotal = totals[period];
  const heightRate = currentTotal / maxTotal;
  const values = allValues[period];

  return {
    appWidth: browser.width,
    filterType,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    period,
    entityType,
    values,
    damageType,
    heightRate,
  };
};

/*
 * Class that wraps the Dot Grid Chart connecting it to parts of the Redux Store
 * Unlike the Line Charts, each Dot Grid Chart gets a single geo entity, time period, and person type
 */
class PieChartWrapper extends Component {
  static propTypes = {
    appWidth: PropTypes.number.isRequired,
    entityType: pt.key.isRequired,
    customGeography: pt.coordinatelist,
    filterType: pt.filterType.isRequired,
    period: PropTypes.string.isRequired,
    values: PropTypes.arrayOf(PropTypes.object),
    startDate: pt.date.isRequired,
    endDate: pt.date.isRequired,
    subheadHeights: PropTypes.shape({
      cyclist: PropTypes.number,
      motorist: PropTypes.number,
      pedestrian: PropTypes.number,
    }),
    radius: PropTypes.number,
    width: PropTypes.number,
    title: PropTypes.string,
    damageType: PropTypes.string.isRequired,
    heightRate: PropTypes.number,
  };

  static defaultProps = {
    values: [],
    customGeography: [], // only if entityType=='custom' see DotGridChartsContainer.jsx
    subheadHeights: {},
    radius: 30,
    width: 20,
    title: '',
    heightRate: 1,
  };

  constructor() {
    super();
    // state stores a "transformed" view of the data,
    // this contains values necessary for the grid of circles drawn by the DotGridChart
    this.state = {
      valuesTransformed: {},
    };
    this.chartContainer = null;
  }

  componentDidMount() {
    const { values, filterType, damageType, heightRate } = this.props;

    // if we already have filtered values, group them so the chart can be drawn
    if (values.length) {
      this.groupEntityData(filterType, values, damageType, heightRate);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { appWidth, values, filterType, startDate, endDate, damageType, heightRate } = nextProps;

    // if we receive filtered values
    if (values.length) {
      // and
      // we didn't have filtered values before
      // or either start or end date changed
      // or crash filter types changed
      // or the viewport was resized
      if (
        !this.props.values.length ||
        startDate !== this.props.startDate ||
        endDate !== this.props.endDate ||
        !isEqual(filterType, this.props.filterType) ||
        appWidth !== this.props.appWidth
      ) {
        // group them so the chart can be drawn
        this.groupEntityData(filterType, values, damageType, heightRate);
      }
    }

    // if an entity is deselected, clear the component state
    if (!values.length && this.props.values.length) {
      this.setState({
        valuesTransformed: {},
      });
    }
  }

  getContainerSize() {
    const cWidth = this.chartContainer.clientWidth;
    const cHeight = this.chartContainer.clientHeight;

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  groupEntityData(filterType, values, damageType, heightRate) {
    const barChartWidth = 30;
    const barChartHeight = heightRate ? 200 * heightRate : 200;
    const pieChartRadius = 50;
    const detailedDataStr = '_by';
    const barChartValues = cloneDeep(values)
      .map(value => {
        Object.keys(value).forEach(key => {
          if (!key.includes(detailedDataStr) && key.includes(damageType)) return;
          delete value[key];
        });
        return value;
      })
      .reduce((total, value) => {
        Object.keys(value).forEach(key => {
          total[key] = total[key] || 0;
          total[key] += value[key];
        });
        return total;
      }, {});

    const pieChartValues = cloneDeep(values)
      .map(value => {
        Object.keys(value).forEach(key => {
          if (key.includes(detailedDataStr) && key.includes(damageType)) return;
          delete value[key];
        });
        return value;
      })
      .reduce((total, value) => {
        Object.keys(value).forEach(key => {
          total[key] = total[key] || 0;
          total[key] += value[key];
        });
        return total;
      }, {});

    this.setState({
      valuesTransformed: {
        barChartWidth,
        barChartHeight,
        pieChartRadius,
        barChartValues,
        pieChartValues,
      },
    });
  }

  render() {
    const { valuesTransformed } = this.state;
    const { entityType, period, damageType } = this.props;
    const chartId = `${period}-${entityType}-${damageType}`;
    const barChartId = `${chartId}-bar-chart`;
    const pieChartId = `${chartId}-pie-chart`;

    return (
      <div
        className="PieChartWrapper"
        ref={_ => {
          this.chartContainer = _;
        }}
      >
        <BarChart
          id={barChartId}
          barChartWidth={valuesTransformed.barChartWidth}
          barChartHeight={valuesTransformed.barChartHeight}
          barChartValues={valuesTransformed.barChartValues}
          damageType={damageType}
        />
        <PieChart
          id={pieChartId}
          pieChartRadius={valuesTransformed.pieChartRadius}
          pieChartValues={valuesTransformed.pieChartValues}
          damageType={damageType}
          personType="motorist"
        />
        <PieChart
          id={pieChartId}
          pieChartWidth={valuesTransformed.barChartWidth}
          pieChartValues={valuesTransformed.pieChartValues}
          damageType={damageType}
          personType="cyclist"
        />
        <PieChart
          id={pieChartId}
          pieChartRadius={valuesTransformed.pieChartRadius}
          pieChartValues={valuesTransformed.pieChartValues}
          damageType={damageType}
          personType="pedestrian"
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(PieChartWrapper);
