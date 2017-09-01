import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import isEqual from 'lodash/isEqual';

import { xScale, yScale, colorScale, line } from '../common/d3Utils';

const margin = { top: 20, right: 20, bottom: 20, left: 20 };
const width = 600 - margin.left - margin.right;
const height = 275 - margin.top - margin.bottom;

/** Class that renders the line chart for selected geographic entities
*/
class DetailChart extends Component {
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

  componentWillReceiveProps(nextProps) {
    const { primary, secondary, nested } = nextProps;

    if (nested.length !== this.props.nested.length) {
      this.initChart();
    }

    if (!isEqual(primary, this.props.primary)) {
      this.updateChart(primary);
    }

    if (!isEqual(secondary, this.props.secondary)) {
      this.updateChart(secondary);
    }
  }

  updateChart() {
    // add or remove some data to / from the chart
    const { primary, secondary } = this.props;
    const nested = { ...primary, ...secondary };
    const svg = d3.select(this.svg);
    const yAxis = this.yAxis;
    const xAxis = this.xAxis;
    const t = svg.transition().duration(750); // transition for updates

    // update xScale domain
    xScale.domain([
      d3.min(nested, d => d.values[0].year_month),
      d3.max(nested, d => d.values[d.values.length - 1].year_month),
    ]);

    // update yScale domain
    yScale.domain([0, d3.max(nested, d => d.maxPedInj)]);

    // update scales in line drawing function
    line.x(d => xScale(d.year_month)).y(d => yScale(d.pedestrian_injured));

    // transition & update the yAxis
    t.select('g.y.axis').call(yAxis);

    // transition & update the xAxis
    t.select('g.x.axis').call(xAxis);

    // update the svg main group element's data binding
    svg.datum(nested, d => d.key);

    // select existing lines, making sure to get their data
    const lines = svg.selectAll('.chart-main').data(d => d);

    // gently transition out lines that should no longer be here
    lines
      .exit()
      .transition(t)
      .style('stroke', 'rgba(255,255,255,0)')
      .remove();

    // update existing lines
    lines
      .transition(t)
      .attr('d', d => line(d.values))
      .attr('stroke', d => colorScale(d.key));

    // create new lines
    lines
      .enter()
      .append('path')
      .attr('class', 'line chart-main')
      .attr('d', d => line(d.values))
      .attr('stroke', d => colorScale(d.key));
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
      <div className="DetailChart">
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

export default DetailChart;
