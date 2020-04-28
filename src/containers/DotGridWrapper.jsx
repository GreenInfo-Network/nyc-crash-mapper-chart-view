import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import isEqual from 'lodash/isEqual';

import * as pt from '../common/reactPropTypeDefs';
import {
  dateRangesSelector,
  primaryEntityValuesFilteredSelector,
  secondaryEntityValuesFilteredSelector,
  customGeographyValuesFilteredSelector,
  referenceEntityValuesFilteredSelector,
} from '../common/reduxSelectors';

import DotGridChart from '../components/DotGridCharts/DotGridChart';

const mapStateToProps = (state, props) => {
  const { browser, filterType } = state;
  const { entityType, period, personType } = props;
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
    personType,
    entityType,
    values,
  };
};

/*
 * Class that wraps the Dot Grid Chart connecting it to parts of the Redux Store
 * Unlike the Line Charts, each Dot Grid Chart gets a single geo entity, time period, and person type
 */
class DotGridWrapper extends Component {
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
    strokeWidth: PropTypes.number,
    title: PropTypes.string,
    personType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    values: [],
    customGeography: [], // only if entityType=='custom' see DotGridChartsContainer.jsx
    subheadHeights: {},
    radius: 5,
    strokeWidth: 1,
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
        this.groupEntityData(filterType, values);
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
    const cWidth = this.chartContainer.clientWidth - 10; // account for padding
    const cHeight = this.chartContainer.clientHeight - 40; // account for padding

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  groupEntityData(filterType, values) {
    // creates the grid used by the chart to draw & position svg circle elements
    const { radius, strokeWidth, personType } = this.props;
    const width = this.getContainerSize().width;
    const chartWidth = width;
    const personInjuredStr = `${personType}_injured`; // map person type to field name injured
    const personKilledStr = `${personType}_killed`; // map person type to field name killed

    // allowed keys in values object
    const allowed = [personInjuredStr, personKilledStr];

    // make sure there will be data before transforming it
    const test = Object.keys(values[0]).filter(key => allowed.includes(key));

    if (test.length) {
      // filter data by person type (e.g. 'pedestrian' or 'motorist' or 'cyclist')
      // but if no injury or fatality was selected for one of the above, this will be an array of empty objects
      const filtered = values.map(item =>
        Object.keys(item)
          .filter(key => allowed.includes(key))
          .reduce((obj, key) => {
            obj[key] = item[key];
            return obj;
          }, {})
      );

      // total up injuries and fatalities if they were included in crash type filters
      const injuredTotal = test.includes(personInjuredStr)
        ? d3.sum(filtered, d => d[personInjuredStr])
        : 0;
      const killedTotal = test.includes(personKilledStr)
        ? d3.sum(filtered, d => d[personKilledStr])
        : 0;

      // use the total of both injury & fatality totals for a "grand total" to calculate the grid
      let harmedTotal = 0;
      if (injuredTotal && killedTotal) {
        harmedTotal = injuredTotal + killedTotal;
      } else if (injuredTotal && !killedTotal) {
        harmedTotal = injuredTotal;
      } else {
        harmedTotal = killedTotal;
      }

      // compute the grid for the circles
      const columns = Math.floor(chartWidth / (radius * 3));
      const rows = Math.floor(harmedTotal / columns);
      const gridHeight = rows * radius * 3 + (radius + strokeWidth) * 2;
      const gridWidth = chartWidth;
      const grid = d3.range(harmedTotal).map(d => ({
        x: (d % columns) * radius * 3,
        y: Math.floor(d / columns) * radius * 3,
      }));

      // set state with the new data which will cause a re-render and pass the data to the chart
      this.setState({
        valuesTransformed: {
          filtered,
          injuredTotal,
          killedTotal,
          harmedTotal,
          columns,
          rows,
          gridHeight,
          gridWidth,
          grid,
        },
      });
    } else {
      // if there was no data to be processed, reset component state
      this.setState({
        valuesTransformed: {},
      });
    }
  }

  render() {
    const { radius, strokeWidth, personType } = this.props;
    const { valuesTransformed } = this.state;

    const drawdots = this.props.entityType !== 'citywide'; // issue 58, dots not certain; skip if citywide

    return (
      <div
        className="DotGridWrapper"
        ref={_ => {
          this.chartContainer = _;
        }}
      >
        <DotGridChart
          data={valuesTransformed}
          drawdots={drawdots}
          {...{ radius, strokeWidth, personType }}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridWrapper);
