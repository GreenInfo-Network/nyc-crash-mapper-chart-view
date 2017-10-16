import React, { Component } from 'react';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import * as pt from '../common/reactPropTypeDefs';
import { filterEntitiesValues } from '../reducers';
import DotGridChart from '../components/DotGridChart';

const mapStateToProps = state => {
  const { filterType } = state;
  const { valuesDateRange1, valuesDateRange2 } = filterEntitiesValues(state);
  return {
    filterType,
    valuesDateRange1,
    valuesDateRange2,
  };
};

class DotGridChartsContainer extends Component {
  static propTypes = {
    filterType: pt.filterType.isRequired,
    valuesDateRange1: pt.valuesByDateRange.isRequired,
    valuesDateRange2: pt.valuesByDateRange.isRequired,
  };

  constructor() {
    super();

    // Internal Component state for storing:
    // - the fixed y position of each subhead (ped, cyclist, motorist)
    // - the grouped/nested data for each entity's time period
    // this is what is passed to the dot grid charts
    this.state = {
      primary: {
        subheadHeights: {
          pedestrian: 0,
          cyclist: 0,
          motorist: 0,
        },
        period1: [],
        period2: [],
      },
      secondary: {
        subheadHeights: {
          pedestrian: 0,
          cyclist: 0,
          motorist: 0,
        },
        period1: [],
        period2: [],
      },
    };

    this.circleRadius = 3; // the size in pixels of each circle's radius
    this.width = 500; // tmp variable for width of the chart
    this.dotGridChart = null; // to store react ref to component
  }

  componentDidMount() {
    const { filterType, valuesDateRange1, valuesDateRange2 } = this.props;

    // if a key for a primary geo entity was set, group the data & set subheading heights
    if (valuesDateRange1.primary.key && valuesDateRange1.primary.values.length) {
      this.setSubheadingHeights(
        this.groupData(filterType, valuesDateRange1, 'primary'),
        this.groupData(filterType, valuesDateRange2, 'primary'),
        'primary'
      );
    }

    // if a key for a secondary geo entity was set, group the data & set subheading heights
    if (valuesDateRange1.secondary.key && valuesDateRange1.secondary.values.length) {
      this.setSubheadingHeights(
        this.groupData(filterType, valuesDateRange1, 'secondary'),
        this.groupData(filterType, valuesDateRange2, 'secondary'),
        'secondary'
      );
    }
  }

  componentWillReceiveProps(nextProps) {
    const { filterType, valuesDateRange1, valuesDateRange2 } = nextProps;

    // Set Component State
    // if a key for a primary geo entity was set, group the data & set subheading heights
    if (valuesDateRange1.primary.key && !this.props.valuesDateRange1.primary.key) {
      this.setSubheadingHeights(
        this.groupData(filterType, valuesDateRange1, 'primary'),
        this.groupData(filterType, valuesDateRange2, 'primary'),
        'primary'
      );
    }

    // if a key for a secondary geo entity was set, group the data & set subheading heights
    if (valuesDateRange1.secondary.key && !this.props.valuesDateRange1.secondary.key) {
      this.setSubheadingHeights(
        this.groupData(filterType, valuesDateRange1, 'secondary'),
        this.groupData(filterType, valuesDateRange2, 'secondary'),
        'secondary'
      );
    }

    // Clear Component State
    // if a primary entity was deselected, reset the component level state for it
    if (!valuesDateRange1.primary.key && this.props.valuesDateRange1.primary.key) {
      this.setState({
        primary: {
          subheadHeights: {
            pedestrian: 0,
            cyclist: 0,
            motorist: 0,
          },
          period1: [],
          period2: [],
        },
      });
    }

    // if a secondary entity was deselected, reset component level state for it
    if (!valuesDateRange2.secondary.key && this.props.valuesDateRange2.secondary.key) {
      this.setState({
        secondary: {
          subheadHeights: {
            pedestrian: 0,
            cyclist: 0,
            motorist: 0,
          },
          period1: [],
          period2: [],
        },
      });
    }
  }

  getContainerSize() {
    const bcr = this.dotGridChart.getBoundingClientRect();
    const cWidth = Math.floor(bcr.width) - 20; // account for inner padding
    const cHeight = Math.floor(bcr.height) - 20; // account for inner padding

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  setSubheadingHeights(period1, period2, entity) {
    // this method sets component state for an geo entity's subheadings y positions
    const yPositions = {};
    const len = period1.length;

    // these should be additive
    d3.range(len).forEach((d, i) => {
      const h1 = period1[i].gridHeight;
      const h2 = period2[i].gridHeight;
      const height = h1 > h2 ? h1 : h2;
      const personType = period1[i].key; // same for both periods
      yPositions[personType] = height + 20;
    });

    // store processed data & subheading heights in component state
    // this will cause a re-render
    this.setState({
      [entity]: {
        subheadHeights: {
          ...yPositions,
        },
        period1,
        period2,
      },
    });
  }

  // eslint-disable-next-line
  groupData(filterType, valuesByDateRange, entity) {
    // Format data for circle charts
    // groups/nests a geographic entity's data for a single date range by person type (ped, cyclist, motorist),
    // computes circle x,y positions for each person type,
    // computes grid height so that person type sub headings can be vertically aligned in the UI
    const { fatality, injury } = filterType;
    const values = valuesByDateRange[entity].values;
    const width = this.getContainerSize().width / 2; // half the container width
    const circleRadius = this.circleRadius;

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
      reordered.push(o);
    });

    reordered.forEach(group => {
      // eslint-disable-next-line
      const values = group.values;
      const injured = values.filter(d => d.harmType === 'injury');
      const killed = values.filter(d => d.harmType === 'fatality');
      const injuredTotal = injured.length ? injured[0].total : 0;
      const killedTotal = killed.length ? killed[0].total : 0;
      const totalHarmed = injuredTotal + killedTotal;
      const columns = Math.floor(width / (circleRadius * 3));
      const rows = Math.ceil(totalHarmed / columns);

      group.killed = killed;
      group.injured = injured;
      group.killedTotal = killedTotal;
      group.injuredTotal = injuredTotal;
      group.totalHarmed = totalHarmed;

      // the fixed height of this group of circles
      group.gridHeight = rows * circleRadius * 3;
      // x, y positions for each circle
      group.grid = d3.range(totalHarmed).map(d => ({
        x: d % columns,
        y: Math.floor(d / columns),
      }));
    });

    return reordered;
  }

  render() {
    const { primary, secondary } = this.state;

    return (
      <div
        className="DotGridChartsContainer"
        ref={_ => {
          this.dotGridChart = _;
        }}
      >
        <div className="dot-grid-entity">
          <DotGridChart data={primary.period1} subheadHeights={primary.subheadHeights} />
          <DotGridChart data={primary.period2} subheadHeights={primary.subheadHeights} />
        </div>
        <div className="dot-grid-entity">
          <DotGridChart data={secondary.period1} subheadHeights={secondary.subheadHeights} />
          <DotGridChart data={secondary.period2} subheadHeights={secondary.subheadHeights} />
        </div>
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridChartsContainer);

// <div className="dot-grid-chart-column">
//   <DotGridChart />
//   <DotGridChart />
// </div>
