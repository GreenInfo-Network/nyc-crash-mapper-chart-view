import React, { Component } from 'react';
// import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as pt from '../common/reactPropTypeDefs';

class DotGridChart extends Component {
  static propTypes = {
    entity: pt.entity.isRequired,
    filterType: pt.filterType.isRequired,
  };

  constructor() {
    super();
    this.container = null; // ref to chart container
    this.svg = null; // ref to svg

    // chart margins
    this.margin = { top: 10, bottom: 25, left: 0, right: 0 };
    // color scale
    this.colorScale = d3
      .scaleOrdinal(['#FFDB65', '#FF972A', '#FE7B8C'])
      .domain(['pedestrian', 'cyclist', 'motorist']);
  }

  componentDidMount() {
    const { entity } = this.props;

    // if data appeared, render the chart
    if (entity.values.length) {
      this.renderChart();
    }
  }

  componentDidUpdate(prevProps) {
    const { entity } = this.props;

    // if data appeared, render the chart
    if (entity.values.length && !prevProps.entity.values.length) {
      this.renderChart();
    }

    // if an entity was deselected, remove the chart
    if (!entity.values.length && prevProps.entity.values.length) {
      this.destroyChart();
    }

    // TO DO: update chart if values in filterType change
  }

  getContainerSize() {
    // returns the width and height for the svg element based on the parent div's width height, which is set via CSS
    const bcr = this.container.getBoundingClientRect();
    const cWidth = Math.floor(bcr.width) - this.margin.right - this.margin.left;
    const cHeight = Math.floor(bcr.height) - this.margin.top - this.margin.bottom;

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  destroyChart() {
    // gracefully remove chart text and circles when there's no more data
    const duration = 750;
    const svg = d3.select(this.svg);
    const g = svg.select('g.main');
    const t = d3
      .transition()
      .duration(duration)
      .ease(d3.easeLinear);

    g
      .selectAll('circle')
      .transition(t)
      .attr('stroke', 'rgba(0,0,0,0)')
      .attr('fill', 'rgba(0,0,0,0)')
      .remove();

    g
      .selectAll('text')
      .transition(t)
      .attr('fill', 'rgba(0,0,0,0)')
      .remove();

    g.transition(t).remove();

    svg
      .transition(t)
      .delay(duration)
      .attr('width', 0)
      .attr('height', 0);
  }

  renderChart() {
    const { entity, filterType } = this.props;
    const { values } = entity;
    const { width, height } = this.getContainerSize();
    const colorScale = this.colorScale;
    const svg = d3.select(this.svg);

    svg.attr('width', width).attr('height', height);

    const g = svg
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    let yOffset = 0;

    // group the data by crash type
    const grouped = [];

    Object.keys(filterType.fatality).forEach(type => {
      if (filterType.fatality[type]) {
        grouped.push({
          type,
          group: 'fatality',
          total: d3.sum(values, d => d[`${type}_killed`]),
        });
      }
    });

    Object.keys(filterType.injury).forEach(type => {
      if (filterType.injury[type]) {
        grouped.push({
          type,
          group: 'injury',
          total: d3.sum(values, d => d[`${type}_injured`]),
        });
      }
    });

    if (!grouped.length) return;

    const nested = d3
      .nest()
      .key(d => d.type)
      .entries(grouped);

    const reordered = [nested[2], nested[0], nested[1]];

    const groups = g
      .selectAll('g.crash-type')
      .data(reordered)
      .enter()
      .append('g')
      .attr('class', 'crash-type');

    // eslint-disable-next-line
    groups.each(function(group, i) {
      // category = bound datum
      // this = svg group element

      const radius = 5;
      const margin = { top: 30, left: 10 };

      const type = group.key;
      const injured = group.values.filter(d => d.group === 'injury');
      const killed = group.values.filter(d => d.group === 'fatality');
      const injuredTotal = injured.length ? injured[0].total : 0;
      const killedTotal = killed.length ? killed[0].total : 0;
      const total = injuredTotal + killedTotal;

      // eslint-disable-next-line
      const emoji = type === 'pedestrian' ? '🚶' : type === 'cyclist' ? '🚴' : '🚙';

      const columns = Math.floor(width / (radius * 3));
      const rows = Math.ceil(total / columns);
      const gridHeight = rows * radius * 3 + margin.top;

      const grid = d3.range(total).map(d => ({
        x: d % columns,
        y: Math.floor(d / columns),
      }));

      // append circles to each group
      // eslint-disable-next-line
      const g = d3.select(this).attr('transform', `translate(0, ${yOffset})`);

      g
        .append('text')
        .attr('x', 5)
        .attr('y', 5)
        .attr('fill', '#333')
        .attr('alignment-baseline', 'hanging')
        .html(
          `${emoji} &nbsp; &nbsp; ${type} fatalities: ${killedTotal} —— ${type} injuries: ${injuredTotal}`
        );

      g
        .selectAll('circle')
        .data(grid)
        .enter()
        .append('circle')
        .attr('cx', d => d.x * radius * 3 + margin.left)
        .attr('cy', d => d.y * radius * 3 + margin.top)
        .attr('r', radius)
        .attr('fill', (d, j) => (j + 1 <= killed ? colorScale(type) : 'none'))
        .attr('stroke', () => colorScale(type));

      // increase the group y-offset so the next group will be positioned below the last
      yOffset += gridHeight;

      // on the last iteration set the SVG height
      const len = groups.nodes().length;

      if (i === len - 1) {
        svg.attr('height', yOffset + 10);
      }
    });
  }

  render() {
    return (
      <div
        className="DotGridChart"
        ref={_ => {
          this.container = _;
        }}
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

export default DotGridChart;
