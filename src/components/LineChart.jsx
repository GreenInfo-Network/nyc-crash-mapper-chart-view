import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

/** Class that renders the line chart for selected geographic entities using D3
*/
class LineChart extends Component {
  static propTypes = {
    appHeight: PropTypes.number.isRequired,
    appWidth: PropTypes.number.isRequired,
    keyPrimary: PropTypes.string,
    keySecondary: PropTypes.string,
    nested: PropTypes.arrayOf(PropTypes.object),
    startDate: PropTypes.instanceOf(Date),
    endDate: PropTypes.instanceOf(Date),
    valuesByDateRange: PropTypes.shape({
      primary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
      secondary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
    }).isRequired,
  };

  static defaultProps = {
    keyPrimary: '',
    keySecondary: '',
    nested: [],
    startDate: {},
    endDate: {},
  };

  constructor() {
    super();
    this.container = null; // ref to containing div
    this.svg = null; // ref to svg element
    this.margin = { top: 10, right: 10, bottom: 20, left: 20 };
    this.yAxis = d3.axisLeft();
    this.xAxis = d3.axisBottom();
    this.xScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
    this.lineGenerator = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale(d.pedestrian_injured))
      .curve(d3.curveMonotoneX);
  }

  componentDidUpdate(prevProps) {
    // do the d3 work here, after the component updated
    const {
      appHeight,
      appWidth,
      nested,
      keyPrimary,
      keySecondary,
      startDate,
      endDate,
    } = this.props;

    // if we receieved data create the chart structure
    if (nested.length && nested.length !== prevProps.nested.length) {
      this.initChart();
    }

    // if keys in our component state differ, update the chart
    if (keyPrimary !== prevProps.keyPrimary || keySecondary !== prevProps.keySecondary) {
      this.updateChart();
    }

    // if the start or end dates changed, update the chart
    if (+startDate !== +prevProps.startDate || +endDate !== +prevProps.endDate) {
      this.updateChart();
    }

    // listen for changes in viewport and resize charts
    if (appHeight !== prevProps.appHeight || appWidth !== prevProps.appWidth) {
      this.resizeChart();
    }
  }

  getContainerSize() {
    const bcr = this.container.getBoundingClientRect();
    const cWidth = Math.floor(bcr.width) - this.margin.right - this.margin.left;
    const cHeight = Math.floor(bcr.height) - this.margin.top - this.margin.bottom;

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  resizeChart() {
    const { width, height } = this.getContainerSize();
    const margin = this.margin;
    const xScale = this.xScale;
    const yScale = this.yScale;
    const yAxis = this.yAxis;
    const xAxis = this.xAxis;
    const svg = d3.select(this.svg);
    const g = svg.select('g.g-parent');
    const t = svg.transition().duration(750);

    // resize the svg element
    svg
      .attr('width', width + margin.top + margin.bottom)
      .attr('height', height + margin.right + margin.left);

    // update ranges for x and y scales
    xScale.range([0, width]);
    yScale.range([height, 0]);

    // update x and y axises scales
    xAxis.scale(xScale);
    yAxis.scale(yScale);

    // update scales in line drawing function
    this.lineGenerator.x(d => xScale(d.year_month)).y(d => yScale(d.pedestrian_injured));

    // transition & update the yAxis
    t.select('g.y.axis').call(yAxis);

    // transition & update the xAxis
    t
      .select('g.x.axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // select existing lines
    const lines = g.selectAll('.line');

    // update existing lines
    lines
      .transition(t)
      .attr('d', d => this.lineGenerator(d.values))
      .attr('stroke', d => d.color);
  }

  updateChart() {
    // adds or removes data to / from the chart
    const { primary, secondary } = this.props.valuesByDateRange;
    const entities = [primary, secondary];
    const xScale = this.xScale;
    const yScale = this.yScale;
    const lineGenerator = this.lineGenerator;
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
    const { width, height } = this.getContainerSize();
    const margin = this.margin;
    const xScale = this.xScale;
    const yScale = this.yScale;
    const yAxis = this.yAxis;
    const xAxis = this.xAxis;
    const svg = d3.select(this.svg);

    if (!nested.length) return;

    // set dimensions of the svg element
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

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
      <div
        ref={_ => {
          this.container = _;
        }}
        className="LineChart"
      >
        <svg
          ref={_ => {
            this.svg = _;
          }}
        />
      </div>
    );
  }
}

export default LineChart;
