import React, { Component } from 'react';
import * as d3 from 'd3';

const margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 0,
};
const width = 960 - margin.left - margin.right;
const height = 100 - margin.top - margin.bottom;
const xScale = d3
  .scaleTime()
  .domain([new Date(2011, 8, 1), new Date()])
  .range([0, width]);

/**
 * Class that implements a "brushable" timeline using d3
 * Two brushes control the date range filtering for two different time periods
 */
class TimeLine extends Component {
  constructor() {
    super();
    this.svg = null; // ref to SVG element
    this.gBrush = null; // brushes container
    this.brushes = []; // keep track of existing brushes
  }

  componentDidMount() {
    this.initTimeline();
  }

  initTimeline() {
    const svg = d3.select(this.svg);
    const g = svg.append('g').attr('transform', `translate(${margin.left}, ${margin.top})`);

    g
      .append('rect')
      .attr('class', 'grid-background')
      .attr('width', width)
      .attr('height', height);

    g
      .append('g')
      .attr('class', 'x grid')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .ticks(d3.timeMonth.every(2))
          .tickSize(-height)
          .tickFormat('')
      )
      .selectAll('.tick')
      .classed('minor', d => d.getMonth());

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .ticks(d3.timeYear.every(1))
          .tickPadding(0)
      )
      .selectAll('text')
      .attr('x', 0)
      .attr('y', 10)
      .style('text-anchor', null);

    this.gBrushes = g.append('g').attr('class', 'brushes');
  }

  render() {
    return (
      <div className="TimeLine">
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

export default TimeLine;
