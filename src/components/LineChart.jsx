import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as pt from '../common/reactPropTypeDefs';

const d3 = Object.assign({}, require('d3'), require('d3-interpolate-path'));

/** Class that renders the line chart for selected geographic entities using D3
*/
class LineChart extends Component {
  static propTypes = {
    appHeight: PropTypes.number.isRequired,
    appWidth: PropTypes.number.isRequired,
    keyPrimary: pt.key,
    keySecondary: pt.key,
    keyReference: pt.key,
    citywide: PropTypes.arrayOf(PropTypes.object), // should be called something else now
    primaryValues: PropTypes.arrayOf(PropTypes.object),
    secondaryValues: PropTypes.arrayOf(PropTypes.object),
    referenceValues: PropTypes.arrayOf(PropTypes.object),
    startDate: pt.dateRange,
    endDate: pt.dateRange,
    primaryColor: PropTypes.string.isRequired,
    secondaryColor: PropTypes.string.isRequired,
    referenceColor: PropTypes.string.isRequired,
    yMax: PropTypes.number,
    y2Max: PropTypes.number,
  };

  static defaultProps = {
    keyPrimary: '',
    keySecondary: '',
    keyReference: '',
    primaryValues: [],
    secondaryValues: [],
    referenceValues: [],
    citywide: [],
    startDate: {},
    endDate: {},
    yMax: 0,
    y2Max: 0,
  };

  constructor() {
    super();

    this.container = null; // ref to containing div
    this.svg = null; // ref to svg element
    this.margin = { top: 10, right: 50, bottom: 20, left: 25 };

    this.yAxis = d3.axisLeft();
    this.yAxis2 = d3.axisRight();
    this.xAxis = d3.axisBottom();

    this.xScale = d3.scaleTime();
    this.yScale = d3.scaleLinear();
    this.yScale2 = d3.scaleLinear();

    this.gridlinesX = () => d3.axisBottom(this.xScale).ticks(5);
    this.gridlinesY = () => d3.axisLeft(this.yScale2).ticks(5);

    // line path generator for primary & secondary entities data
    this.lineGenerator = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale(d.count))
      .curve(d3.curveMonotoneX);

    // line path generator for citywide data
    this.lineGenerator2 = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale2(d.count))
      .curve(d3.curveMonotoneX);
  }

  componentDidMount() {
    const { referenceValues } = this.props;

    // if the app loaded with pre-fetched data OR if the user toggled between "trend" and "compare"
    // make sure to create and update the chart
    if (referenceValues && referenceValues.length) {
      this.initChart();
      this.updateChart();
    }
  }

  componentDidUpdate(prevProps) {
    // do the d3 work here, after the component updated
    // diff current props (this.props) with previous props (prevProps) to detect what's changed
    const {
      appHeight,
      appWidth,
      keyPrimary,
      keySecondary,
      keyReference,
      referenceValues,
      startDate,
      endDate,
      yMax,
      y2Max,
    } = this.props;

    // a truthy value to use to tell if our chart has been set up yet
    // if the outer most svg group exists, then our chart has been created
    const chartExists = d3
      .select(this.svg)
      .select('g')
      .node();

    if (!chartExists) {
      // citywide data is always loaded regardless of other entities, so set up the chart if it exists
      if (referenceValues.length && !prevProps.referenceValues.length) {
        this.initChart();
      }
    }

    if (chartExists) {
      // if keys in our component state differ, update the chart
      if (
        keyPrimary !== prevProps.keyPrimary ||
        keySecondary !== prevProps.keySecondary ||
        (referenceValues.length && keyReference !== prevProps.keyReference)
      ) {
        this.updateChart();
      }

      // if the start or end dates changed, update the chart
      if (+startDate !== +prevProps.startDate || +endDate !== +prevProps.endDate) {
        this.updateChart();
      }

      // if the max y values changed then update the chart
      if (yMax !== prevProps.yMax || y2Max !== prevProps.y2Max) {
        this.updateChart();
      }

      // listen for changes in viewport and resize charts
      if (appHeight !== prevProps.appHeight || appWidth !== prevProps.appWidth) {
        this.resizeChart();
      }
    }
  }

  getContainerSize() {
    // set the width and height of the svg from the parent div's width height, which is set via CSS
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
    const yScale2 = this.yScale2;
    const yAxis = this.yAxis;
    const yAxis2 = this.yAxis2;
    const xAxis = this.xAxis;
    const svg = d3.select(this.svg);
    const g = svg.select('g.g-parent');
    const t = g.transition().duration(750);

    // resize the svg element
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.bottom + margin.top);

    // reposition the main group element
    g.attr('transform', `translate(${margin.left}, ${margin.top})`);

    // update ranges for x and y scales
    xScale.range([0, width]);
    yScale.range([height, 0]);
    yScale2.range([height, 0]);

    // update x and y axises scales
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    yAxis2.scale(yScale2);

    // update scales in line drawing function
    this.lineGenerator.x(d => xScale(d.year_month)).y(d => yScale(d.count));

    // transition & update the y axises
    t.select('g.y.axis').call(yAxis);
    t
      .select('g.y2.axis')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxis2);

    // transition & update the xAxis
    t
      .select('g.x.axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis);

    // transition & update the vertical gridlines
    t
      .select('g.x.grid')
      .attr('transform', `translate(0, ${height})`)
      .call(
        this.gridlinesX()
          .tickSize(-height)
          .tickFormat('')
      );

    // transition & update the horizontal gridlines
    t.select('g.y.grid').call(
      this.gridlinesY()
        .tickSize(-width)
        .tickFormat('')
    );

    // select existing lines
    const lines = g.selectAll('.line');

    // update existing lines
    lines
      .transition(t)
      .attr('d', d => this.lineGenerator(d.values))
      .attr('stroke', d => d.color);

    // update citywide line
    g
      .selectAll('.line-citywide')
      .transition(t)
      .attr('d', d => this.lineGenerator2(d));
  }

  updateChart() {
    // adds or removes data to / from the chart
    const {
      primaryValues,
      secondaryValues,
      referenceValues,
      keyPrimary,
      keySecondary,
      primaryColor,
      secondaryColor,
      yMax,
      y2Max,
    } = this.props;
    const { width, height } = this.getContainerSize();
    const entities = [
      {
        values: primaryValues,
        key: keyPrimary,
        color: primaryColor,
      },
      {
        values: secondaryValues,
        key: keySecondary,
        color: secondaryColor,
      },
    ];
    const xScale = this.xScale;
    const yScale = this.yScale;
    const yScale2 = this.yScale2;
    const xAxis = this.xAxis;
    const yAxis = this.yAxis;
    const yAxis2 = this.yAxis2;
    const lineGenerator = this.lineGenerator;
    const lineGenerator2 = this.lineGenerator2;
    const svg = d3.select(this.svg);
    const g = svg.select('g.g-parent');
    const t = g.transition().duration(750); // transition for updates

    // update xScale domain
    xScale.domain(d3.extent(referenceValues, d => d.year_month));

    // update yScale domain
    yScale.domain([0, yMax]);

    // update citywide yScale domain
    yScale2.domain([0, y2Max]);

    // update scales in line drawing function
    lineGenerator.x(d => xScale(d.year_month)).y(d => yScale(d.count));
    lineGenerator2.x(d => xScale(d.year_month)).y(d => yScale2(d.count));

    // transition & update the y axises
    t.select('g.y.axis').call(yAxis);
    t.select('g.y2.axis').call(yAxis2);

    // transition & update the x axis
    t.select('g.x.axis').call(xAxis);

    // transition & update the vertical gridlines
    t.select('g.x.grid').call(
      this.gridlinesX()
        .tickSize(-height)
        .tickFormat('')
    );

    // transition & update the horizontal gridlines
    t.select('g.y.grid').call(
      this.gridlinesY()
        .tickSize(-width)
        .tickFormat('')
    );

    // transition the citywide line
    g
      .selectAll('.line-citywide')
      .data([referenceValues])
      .transition(t)
      // eslint-disable-next-line
      .attrTween('d', function(d) {
        const previous = d3.select(this).attr('d');
        const current = lineGenerator2(d);
        return d3.interpolatePath(previous, current);
      });

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
      // eslint-disable-next-line
      .attrTween('d', function(d) {
        const previous = d3.select(this).attr('d');
        const current = lineGenerator(d.values);
        return d3.interpolatePath(previous, current);
      })
      // .attr('d', d => lineGenerator(d.values))
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
    const { referenceValues, y2Max } = this.props;
    const { width, height } = this.getContainerSize();
    const margin = this.margin;
    const xScale = this.xScale;
    const yScale = this.yScale;
    const yScale2 = this.yScale2;
    const yAxis = this.yAxis;
    const yAxis2 = this.yAxis2;
    const xAxis = this.xAxis;
    const svg = d3.select(this.svg);

    // set dimensions of the svg element
    svg
      .attr('width', width + margin.left + margin.right)
      .attr('height', height + margin.top + margin.bottom);

    // set scale domains and ranges
    yScale.range([height, 0]).domain([0, 0]);
    yScale2.range([height, 0]).domain([0, y2Max]);
    xScale.range([0, width]).domain(d3.extent(referenceValues, d => d.year_month));

    // set scales for axises
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    yAxis2.scale(yScale2);

    // main svg group element
    const g = svg
      .append('g')
      .attr('class', 'g-parent')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // vertical grid lines
    g
      .append('g')
      .attr('class', 'grid x')
      .attr('transform', `translate(0, ${height})`)
      .call(
        this.gridlinesX()
          .tickSize(-height - margin.top - margin.bottom)
          .tickFormat('')
      );

    // horizontal grid lines
    g
      .append('g')
      .attr('class', 'grid y')
      .call(
        this.gridlinesY()
          .tickSize(-width)
          .tickFormat('')
      );

    g
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    g
      .append('g')
      .attr('class', 'y2 axis')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxis2);

    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis.ticks(5));

    // draw the citywide line
    g
      .selectAll('.line-citywide')
      .data([referenceValues])
      .enter()
      .append('path')
      .attr('class', 'line-citywide')
      .attr('d', d => this.lineGenerator2(d))
      .attr('stroke', '#999')
      .attr('opacity', 0.7);
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
