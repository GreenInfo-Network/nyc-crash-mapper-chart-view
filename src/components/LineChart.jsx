import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// TO DO: move these to LineChart class?
const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 500 - margin.left - margin.right;
const height = 275 - margin.top - margin.bottom;
const xScale = d3.scaleTime().range([0, width]);
const yScale = d3.scaleLinear().range([height, 0]);
const lineGenerator = d3
  .line()
  .x(d => xScale(d.year_month))
  .y(d => yScale(d.pedestrian_injured))
  .curve(d3.curveMonotoneX);

/** Class that renders the line chart for selected geographic entities
*/
class LineChart extends Component {
  static propTypes = {
    primary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    secondary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    nested: PropTypes.arrayOf(PropTypes.object),
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
  };

  static defaultProps = {
    primary: {},
    secondary: {},
    nested: [],
    startDate: {},
    endDate: {},
  };

  constructor() {
    super();
    this.state = {
      primaryEntity: { key: '', values: [] },
      secondaryEntity: { key: '', values: [] },
    };
    this.svg = null; // ref to svg element
    this.yAxis = d3.axisLeft();
    this.xAxis = d3.axisBottom();
  }

  componentWillReceiveProps(nextProps) {
    const { primary, secondary, startDate, endDate } = nextProps;

    // diff the keys, if they're different filter data
    // (when a entity is added and wasn't there previously, needs to have its values filtered)
    if (primary.key !== this.props.primary.key || secondary.key !== this.props.secondary.key) {
      this.filterData(primary, secondary, startDate, endDate);
    }

    // diff the start and end dates, if they're different filter data
    if (+startDate !== +this.props.startDate || +endDate !== +this.props.endDate) {
      this.filterData(primary, secondary, startDate, endDate);
    }
  }

  componentDidUpdate(prevProps, prevState) {
    // do the d3 work here, after the component updated
    const { nested, startDate, endDate } = this.props;
    const { primaryEntity, secondaryEntity } = this.state;

    // if we receieved data create the chart structure
    if (nested.length && nested.length !== prevProps.nested.length) {
      this.initChart();
    }

    // if keys in our component state differ, update the chart
    if (
      primaryEntity.key !== prevState.primaryEntity.key ||
      secondaryEntity.key !== prevState.secondaryEntity.key
    ) {
      this.updateChart();
    }

    // if the start or end dates changed, update the chart
    if (+startDate !== +prevProps.startDate || +endDate !== +prevProps.endDate) {
      this.updateChart();
    }
  }

  filterData(primary, secondary, startDate, endDate) {
    // TO DO: move filtering logic to a reducer so that other chart widgets have access
    const primaryEntity = {
      ...primary,
      values: this.filterValuesByDateRange(primary.values, startDate, endDate),
    };

    const secondaryEntity = {
      ...secondary,
      values: this.filterValuesByDateRange(secondary.values, startDate, endDate),
    };

    // store copies of our entities so that we aren't mutating them
    // this will cause a re-render that we can detect and have d3 respond to
    this.setState({
      primaryEntity,
      secondaryEntity,
    });
  }

  // eslint-disable-next-line
  filterValuesByDateRange(values, startDate, endDate) {
    // filters array of objects by date ranges
    return values.filter(d => {
      if (+d.year_month >= +startDate && +d.year_month <= +endDate) {
        return true;
      }
      return false;
    });
  }

  updateChart() {
    // adds or removes data to / from the chart
    const { primaryEntity, secondaryEntity } = this.state;
    const entities = [primaryEntity, secondaryEntity];
    const svg = d3.select(this.svg);
    const g = svg.select('g.g-parent');
    const yAxis = this.yAxis;
    const xAxis = this.xAxis;
    const t = svg.transition().duration(750); // transition for updates

    // update xScale domain
    xScale.domain([
      d3.min(entities, d => (d.values.length ? d.values[0].year_month : null)),
      d3.max(entities, d => (d.values.length ? d.values[d.values.length - 1].year_month : null)),
    ]);

    // update yScale domain
    yScale.domain([0, d3.max(entities, d => (d.maxPedInj ? d.maxPedInj : null))]);

    // update scales in line drawing function
    lineGenerator.x(d => xScale(d.year_month)).y(d => yScale(d.pedestrian_injured));

    // transition & update the yAxis
    t.select('g.y.axis').call(yAxis);

    // transition & update the xAxis
    t.select('g.x.axis').call(xAxis);

    // update the svg main group element's data binding
    g.datum(entities, d => d.key);

    // select existing lines, making sure to get their data
    const lines = g.selectAll('.line').data(d => d);

    // gently transition out lines that should no longer be here
    lines
      .exit()
      .transition(t)
      .style('stroke', 'rgba(255, 255, 255, 0)')
      .remove();

    // update existing lines
    lines
      .transition(t)
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => d.color);

    // create new lines
    lines
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => d.color);
  }

  initChart() {
    // initially render / set up the chart with, scales, axises, & grid lines; but no lines
    const { nested } = this.props;
    const yAxis = this.yAxis;
    const xAxis = this.xAxis;
    const svg = d3.select(this.svg);

    if (!nested.length) return;

    // set scale domains and ranges
    yScale.range([height, 0]).domain([0, d3.max(nested, d => d.maxPedInj)]);
    xScale
      .range([0, width])
      .domain([
        d3.min(nested, c => c.values[0].year_month),
        d3.max(nested, c => c.values[c.values.length - 1].year_month),
      ]);

    // set scales for axises
    xAxis.scale(xScale);
    yAxis.scale(yScale);

    const g = svg
      .append('g')
      .attr('class', 'g-parent')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    g
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis.ticks(5));
  }

  render() {
    return (
      <div className="LineChart">
        <svg
          ref={_ => {
            this.svg = _;
          }}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        />
      </div>
    );
  }
}

export default LineChart;
