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
    this.margin = { top: 10, bottom: 25, left: 10, right: 10 };
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

  renderChart() {
    const { entity } = this.props;
    const { width, height } = this.getContainerSize();
    const svg = d3.select(this.svg);

    svg
      .attr('width', width)
      .attr('height', height)
      .datum(entity.values);
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
