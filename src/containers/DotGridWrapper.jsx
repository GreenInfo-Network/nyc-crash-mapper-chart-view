import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
} from '../common/reduxSelectors';

import DotGridChart from '../components/DotGridCharts/DotGridChart';

const mapStateToProps = (state, props) => {
  const { browser, filterType } = state;
  const { entityType, period } = props;
  const dateRange = dateRangesSelector(state, props);
  const values =
    entityType === 'primary'
      ? primaryEntityValuesFilteredSelector(state, props)
      : secondaryEntityValuesFilteredSelector(state, props);

  return {
    appWidth: browser.width,
    filterType,
    startDate: dateRange.startDate,
    endDate: dateRange.endDate,
    period,
    entityType,
    values,
  };
};

/*
 * Class that wraps the Dot Grid Chart connecting it to parts of the Redux Store
 * Unlike the Line Charts, each Dot Grid Chart gets a single geo entity and time period
*/
class DotGridWrapper extends Component {
  static propTypes = {
    appWidth: PropTypes.number.isRequired,
    entityType: pt.key.isRequired,
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
    strokeWidth: PropTypes.number,
    title: PropTypes.string,
    setEntityPeriodValues: PropTypes.func.isRequired,
  };

  static defaultProps = {
    values: [],
    subheadHeights: {},
    radius: 5,
    strokeWidth: 1,
    title: '',
  };

  constructor() {
    super();
    this.state = {
      valuesGrouped: [],
    };
    this.chartContainer = null;
  }

  componentDidMount() {
    const { values, filterType } = this.props;

    // if we already have filtered values, group them so the chart can be drawn
    if (values.length) {
      this.groupEntityData(filterType, values);
    }
  }

  componentWillReceiveProps(nextProps) {
    const { appWidth, values, filterType, startDate, endDate } = nextProps;

    // if we receive filtered values
    if (values.length) {
      // and we didn't have filtered values before
      // or either start or end date changed
      if (
        !this.props.values.length ||
        startDate !== this.props.startDate ||
        endDate !== this.props.endDate
      ) {
        // group them so the chart can be drawn
        this.groupEntityData(filterType, values);
      }
    }

    // if an entity is deselected, clear the component state
    if (!values.length && this.props.values.length) {
      this.setState({
        valuesGrouped: [],
      });
    }

    // if app was resized, recalculate grid
    if (values.length && appWidth !== this.props.appWidth) {
      this.groupEntityData(filterType, values);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    const { valuesGrouped } = prevState;
    const { period, entityType, setEntityPeriodValues } = this.props;

    // send the grouped data to the parent component so it can calculate subheading heights between adjacent charts
    if (
      (!valuesGrouped.length && this.state.valuesGrouped.length) ||
      (this.state.valuesGrouped.length &&
        valuesGrouped[0].gridWidth !== this.state.valuesGrouped[0].gridWidth)
    ) {
      setEntityPeriodValues(this.state.valuesGrouped, period, entityType);
    }
  }

  getContainerSize() {
    const cWidth = this.chartContainer.clientWidth - 10; // account for padding
    const cHeight = this.chartContainer.clientHeight - 40; // account for padding

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  groupEntityData(filterType, values) {
    // groups the data by ped, cyclist, motorist (if either injury or fatality is selected for any)
    // creates the grid used by the chart to draw & position svg circle elements
    const { radius, strokeWidth } = this.props;
    const { injury, fatality } = filterType;
    const width = this.getContainerSize().width;
    const chartWidth = width; // minus padding

    // group the data by crash type
    const grouped = [];

    Object.keys(fatality).forEach(type => {
      if (fatality[type]) {
        grouped.push({
          personType: type,
          harmType: 'fatality',
          total: d3.sum(values, d => d[`${type}_killed`]),
        });
      }
    });

    Object.keys(injury).forEach(type => {
      if (injury[type]) {
        grouped.push({
          personType: type,
          harmType: 'injury',
          total: d3.sum(values, d => d[`${type}_injured`]),
        });
      }
    });

    const nested = d3
      .nest()
      .key(d => d.personType)
      .entries(grouped);

    // make sure the order is always 1 pedestrian, 2 cyclist, 3 motorist
    const order = ['pedestrian', 'cyclist', 'motorist'];
    const reordered = [];
    order.forEach(ptype => {
      const o = nested.find(group => group.key === ptype);
      if (o) {
        reordered.push(o);
      }
    });

    // create a grid (array of objects) with values for x,y positions for each circle
    reordered.forEach(group => {
      // eslint-disable-next-line
      const values = group.values;
      const injured = values.filter(d => d.harmType === 'injury');
      const killed = values.filter(d => d.harmType === 'fatality');
      const injuredTotal = injured.length ? injured[0].total : 0;
      const killedTotal = killed.length ? killed[0].total : 0;
      const totalHarmed = injuredTotal + killedTotal;
      const columns = Math.floor(chartWidth / (radius * 3));
      const rows = Math.floor(totalHarmed / columns);

      group.killed = killed;
      group.injured = injured;
      group.killedTotal = killedTotal;
      group.injuredTotal = injuredTotal;
      group.totalHarmed = totalHarmed;

      // the fixed height of this group of circles
      group.gridHeight = rows * radius * 3 + (radius + strokeWidth) * 2;
      group.gridWidth = chartWidth;
      // x, y positions for each circle
      group.grid = d3.range(totalHarmed).map(d => ({
        x: (d % columns) * radius * 3,
        y: Math.floor(d / columns) * radius * 3,
      }));
    });

    this.setState({
      valuesGrouped: reordered,
    });
  }

  render() {
    const { startDate, endDate, radius, strokeWidth, title, subheadHeights } = this.props;
    const { valuesGrouped } = this.state;

    return (
      <div
        className="DotGridWrapper"
        ref={_ => {
          this.chartContainer = _;
        }}
      >
        <DotGridChart
          data={valuesGrouped}
          {...{ startDate, endDate, subheadHeights, radius, strokeWidth, title }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridWrapper);
