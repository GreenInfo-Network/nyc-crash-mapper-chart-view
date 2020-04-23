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

const mapStateToProps = (state, props) => {
  const { browser, filterType } = state;
  const { entityType, period, damageType } = props;
  const dateRange = dateRangesSelector(state, props);

  let values = [];
  switch (entityType) {
    case 'primary':
      values = primaryEntityValuesFilteredSelector(state, props);
      break;
    case 'secondary':
      values = secondaryEntityValuesFilteredSelector(state, props);
      break;
    case 'citywide':
      values = referenceEntityValuesFilteredSelector(state, props);
      break;
    case 'custom':
      values = customGeographyValuesFilteredSelector(state, props);
      break;
    default:
      throw new Error('DotGridWrapper got unexpected entityType');
  }

  return {
    appWidth: browser.width,
    filterType,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    period,
    entityType,
    values,
    damageType,
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
  };

  static defaultProps = {
    values: [],
    customGeography: [], // only if entityType=='custom' see DotGridChartsContainer.jsx
    subheadHeights: {},
    radius: 30,
    width: 20,
    title: '',
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
    const { values, filterType, damageType } = this.props;

    // if we already have filtered values, group them so the chart can be drawn
    if (values.length) {
      this.groupEntityData(filterType, values, damageType);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { appWidth, values, filterType, startDate, endDate, damageType } = nextProps;

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
        this.groupEntityData(filterType, values, damageType);
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

  groupEntityData(filterType, values, damageType) {
    const barChartWidth = 30;
    const barChartHeight = 200;
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
