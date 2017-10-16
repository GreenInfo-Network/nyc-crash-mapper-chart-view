import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

// import * as pt from '../common/reactPropTypeDefs';

class DotGridChart extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    subheadHeights: PropTypes.shape({
      cyclist: PropTypes.number,
      motorist: PropTypes.number,
      pedestrian: PropTypes.number,
    }),
  };

  static defaultProps = {
    data: [],
    subheadHeights: {},
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
    const { data } = this.props;

    // if data appeared, render the chart
    if (data.length) {
      this.renderChart();
    }
  }

  componentDidUpdate(prevProps) {
    const { data } = this.props;

    // if data appeared, render the chart
    if (data.length && !prevProps.data.length) {
      this.renderChart();
    }

    // if an entity was deselected, remove the chart
    if (!data.length && prevProps.data.length) {
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
    const { data, subheadHeights } = this.props;
    const colorScale = this.colorScale;
    const { width } = this.getContainerSize();
    const svg = d3.select(this.svg);

    const newHeight = data.reduce((acc, cur) => {
      acc += cur.gridHeight + 20;
      return acc;
    }, 0);

    svg.attr('width', width).attr('height', newHeight);

    const g = svg
      .append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    const groups = g
      .selectAll('g.crash-type')
      .data(data)
      .enter()
      .append('g')
      .attr('class', 'crash-type');

    let yOffset = 0;

    // eslint-disable-next-line
    groups.each(function(group, i) {
      // category = bound datum
      // this = svg group element
      const { key, killed, killedTotal, injuredTotal, grid } = group;
      const type = key;
      const radius = 3;
      const margin = { top: 30, left: 10 };

      // eslint-disable-next-line
      const emoji = type === 'pedestrian' ? '🚶' : type === 'cyclist' ? '🚴' : '🚙';

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

      yOffset += subheadHeights[type] + 10;
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
