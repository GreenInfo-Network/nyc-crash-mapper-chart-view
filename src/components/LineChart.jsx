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
  };

  static defaultProps = {
    primary: {},
    secondary: {},
    nested: [],
  };

  constructor() {
    super();
    this.svg = null; // ref to svg element
    this.yAxis = d3.axisLeft();
    this.xAxis = d3.axisBottom();
  }

  componentDidUpdate(prevProps) {
    const { primary, secondary, nested } = this.props;

    if (nested.length && nested.length !== prevProps.nested.length) {
      this.initChart();
    }

    if (primary.key !== prevProps.primary.key || secondary.key !== prevProps.secondary.key) {
      this.updateChart([{ ...primary }, { ...secondary }]);
    }
  }

  updateChart(entities) {
    // add or remove some data to / from the chart
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
      .call(xAxis);
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
