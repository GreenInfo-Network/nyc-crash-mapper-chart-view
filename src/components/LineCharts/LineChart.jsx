import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as pt from '../../common/reactPropTypeDefs';
import { formatDate, formatNumber } from '../../common/d3Utils';
import styleVars from '../../common/styleVars';
import entityTypeDisplay from '../../common/labelFormatters';

/** Class that renders the line chart for selected geographic entities using D3
*/
class LineChart extends Component {
  static propTypes = {
    appHeight: PropTypes.number.isRequired,
    appWidth: PropTypes.number.isRequired,
    period: PropTypes.string.isRequired,
    entityType: PropTypes.string,
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
    entityType: '',
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

    // line path generator for reference data
    this.lineGenerator2 = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale2(d.count))
      .curve(d3.curveMonotoneX);

    // look up function for finding a data value
    this.bisectDate = d3.bisector(d => d.year_month).left;
  }

  componentDidMount() {
    const { referenceValues } = this.props;

    // if the app loaded with pre-fetched data OR if the user toggled between "trend" and "compare"
    // make sure to create and update the chart
    if (referenceValues && referenceValues.length) {
      this.initChart();
      this.initTooltips();
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

  initTooltips() {
    // contains the logic for showing, hiding, and creating tooltip contents
    const {
      entityType,
      keyReference,
      keyPrimary,
      keySecondary,
      referenceValues,
      primaryValues,
      secondaryValues,
    } = this.props;
    const margin = this.margin;
    const { width } = this.getContainerSize();
    const svg = d3.select(this.svg);
    const rect = svg.select('rect.tooltip-overlay');
    const tooltip = svg.select('g.tooltip');
    const tooltipLine = svg.select('g.g-parent').select('line.tooltip-line');
    // notice the "let" here, this value can be modified if tooltip text exceeds its default width
    let tooltipWidth = styleVars['linechart-tooltip-w'];
    const tooltipHeight = styleVars['linechart-tooltip-h'];
    const entityLabel = entityTypeDisplay(entityType);
    const xScale = this.xScale;
    const bisectDate = this.bisectDate;

    function lookUpDatum(date, values) {
      // use d3's bisector to find the object in values array closest to a given date
      const i = bisectDate(values, date, 1);
      const d0 = values[i - 1];
      const d1 = values[i];
      if (!d0 || !d1) return null;
      return date - d0.year_month > d1.year_month - date ? d1 : d0;
    }

    function calcYPos(entity) {
      // determine what y position the "total" label for a primary or entity should be
      let yPrimary = 0;
      let ySecondary = 0;

      if (keyPrimary && keySecondary) {
        yPrimary = 60;
        ySecondary = 80;
      }

      if (keyPrimary && !keySecondary) {
        yPrimary = 60;
      }

      if (!keyPrimary && keySecondary) {
        ySecondary = 60;
      }

      return entity === 'primary' ? yPrimary : ySecondary;
    }

    function handleMouseMove() {
      // use the mouse x position to look up data so we can display it in the tooltip div
      const mouse = d3.mouse(this);
      const mouseX = mouse[0];
      // this grabs the corresponding date from the xScale, not necessary the date in the data
      const xValue = xScale.invert(mouseX);
      // use d3's bisector to find the closest datum to the date above
      const d = lookUpDatum(xValue, referenceValues);

      if (d) {
        // write the formatted date for that datum
        tooltip
          .select('text.tooltip-date')
          .attr('x', '10px')
          .attr('y', '20px')
          .text(formatDate(d.year_month));

        // write out the total for the reference entity
        tooltip
          .select('text.tooltip-ref')
          .attr('x', '10px')
          .attr('y', '40px')
          .text(`${keyReference} total: ${formatNumber(d.count)}`);
      }

      // repeat the above steps for primary entity
      if (keyPrimary !== '' && primaryValues.length) {
        const k = lookUpDatum(xValue, primaryValues);
        const y = calcYPos('primary');
        tooltip
          .select('text.tooltip-primary')
          .attr('x', '10px')
          .attr('y', `${y}px`)
          .text(`${entityLabel} ${keyPrimary} total: ${formatNumber(k.count)}`);
      } else {
        // if a user deselected the entity then set it's text to be empty
        tooltip.select('text.tooltip-primary').text('');
      }

      // repeat the above steps for secondary entity
      if (keySecondary !== '' && secondaryValues.length) {
        const n = lookUpDatum(xValue, secondaryValues);
        const y = calcYPos('secondary');
        tooltip
          .select('text.tooltip-secondary')
          .attr('x', '10px')
          .attr('y', `${y}px`)
          .text(`${entityLabel} ${keySecondary} total: ${formatNumber(n.count)}`);
      } else {
        // if a user deselected the entity then set it's text to be empty
        tooltip.select('text.tooltip-secondary').text('');
      }

      // alter the rectangle's width & height if a primary or secondary entity are selected
      if (keyPrimary || keySecondary) {
        const h1 = calcYPos('primary');
        const h2 = calcYPos('secondary');
        const h = h2 > h1 ? h2 : h1;
        tooltip.select('rect').attr('height', `${h + 10}px`);
        // iterate over all text elements to find the one with the largest width
        const textElements = tooltip.selectAll('text');
        // eslint-disable-next-line
        textElements.each(function() {
          const c = d3
            .select(this)
            .node()
            .getBoundingClientRect();
          // reset value for the width of the tooltip's rect if text is longer then the default minus padding
          tooltipWidth = c.width > tooltipWidth - 20 ? (tooltipWidth = c.width + 20) : tooltipWidth;
        });
        // set the tooltip's rect width based on the largest text width if needed
        tooltip.select('rect').attr('width', `${tooltipWidth}px`);
      } else {
        tooltip.select('rect').attr('height', `${tooltipHeight}px`);
        tooltip.select('rect').attr('width', `${tooltipWidth}px`);
      }

      // adjust the tooltip's vertical reference line
      if (d) {
        tooltipLine.attr('x1', () => xScale(d.year_month)).attr('x2', () => xScale(d.year_month));
      }

      // position the tooltip to the left of the datum if its close to the right side of the chart
      let rectXOffset = 5;
      if (mouseX >= width - margin.left - margin.right - tooltipWidth) {
        rectXOffset = -tooltipWidth - rectXOffset; // 20 accounts for padding on left & right
      }

      // finally set the tooltip position
      if (d) {
        const yOffset = xScale(d.year_month) + margin.left + rectXOffset;
        tooltip.attr('transform', `translate(${yOffset}, 20)`);
      }
    }

    // attach event listeners to invisible rectangle
    rect
      .on('mouseover', () => {
        tooltip.attr('visibility', 'visible');
        tooltipLine.attr('visibility', 'visible');
      })
      .on('mouseout', () => {
        tooltip.attr('visibility', 'hidden');
        tooltipLine.attr('visibility', 'hidden');
      })
      .on('mousemove', handleMouseMove);
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

    // resize the clipath
    g
      .select('defs')
      .select('clipPath')
      .select('rect')
      .attr('y', -2) // allow room for line path's stroke width
      .attr('width', width)
      .attr('height', height + 2);

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

    // resize invisible rectangle that will detect mouseovers for displaying tooltips
    g
      .select('rect.tooltip-overlay')
      .attr('width', width)
      .attr('height', height);

    // resize reference line to show where the tooltip is selecting data
    g
      .select('line.tooltip-line')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', height);

    // update tooltips settings
    this.initTooltips();
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
      period,
      startDate,
      endDate,
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
    // transition for updates
    const t = g
      .transition()
      .duration(750)
      .ease(d3.easeLinear);

    // update xScale domain
    xScale.domain([startDate, endDate]);

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

    // transition the reference line
    g
      .selectAll('.line-citywide')
      .data([referenceValues])
      .transition(t)
      .attr('d', d => lineGenerator2(d));

    // update the svg main group element's data binding
    g.datum(entities, d => d.key);

    // select existing lines, making sure to get their data
    const lines = g.selectAll('.line').data(d => d);

    // gently transition out lines that should no longer be here
    lines
      .exit()
      .transition(t)
      .attr('stroke-opacity', 0)
      .remove();

    // update existing lines
    lines
      .transition(t)
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => d.color)
      .attr('clip-path', `url(#clip-${period})`);

    // create new lines
    lines
      .enter()
      .append('path')
      .attr('class', 'line')
      .attr('d', d => lineGenerator(d.values))
      .attr('stroke', d => d.color)
      .attr('stroke-opacity', 1);

    // reset the tooltips
    this.initTooltips();
  }

  initChart() {
    // initially render / set up the chart with, scales, axises, & grid lines; but no lines
    const { period, referenceValues, referenceColor, y2Max, startDate, endDate } = this.props;
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
    xScale.range([0, width]).domain([startDate, endDate]);

    // set scales for axises
    xAxis.scale(xScale);
    yAxis.scale(yScale);
    yAxis2.scale(yScale2);

    // main svg group element
    const g = svg
      .append('g')
      .attr('class', 'g-parent')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    // set up a clipath to prevent data from appearing outside of the chart bounds
    g
      .append('defs')
      .append('clipPath')
      .attr('id', `clip-${period}`)
      .append('rect')
      .attr('y', -2) // allow room for line path's stroke width
      .attr('width', width)
      .attr('height', height + 2);

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

    // first y axis
    g
      .append('g')
      .attr('class', 'y axis')
      .call(yAxis);

    // second y axis
    g
      .append('g')
      .attr('class', 'y2 axis')
      .attr('transform', `translate(${width}, 0)`)
      .call(yAxis2);

    // x axis
    g
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(xAxis.ticks(5));

    // invisible rect element used to detect mouse events for tooltips
    g
      .append('rect')
      .classed('tooltip-overlay', true)
      .attr('pointer-events', 'all')
      .attr('fill', 'none')
      .attr('width', width)
      .attr('height', height);

    // reference line
    g
      .selectAll('.line-reference')
      .data([referenceValues])
      .enter()
      .append('path')
      .attr('class', 'line-citywide')
      .attr('d', d => this.lineGenerator2(d))
      .attr('stroke', referenceColor)
      .attr('opacity', 0.7)
      .attr('clip-path', `url(#clip-${period})`);

    // separate svg group element for the tooltip
    const tooltip = svg.append('g').classed('tooltip', true);

    // tooltip background rectangle with rounded corners
    tooltip
      .append('rect')
      .attr('fill', 'rgb(35, 35, 35)')
      .attr('fill-opacity', 0.8)
      .attr('rx', 4)
      .attr('ry', 4);
    tooltip.append('text').classed('tooltip-date', true);
    tooltip.append('text').classed('tooltip-ref', true);
    tooltip.append('text').classed('tooltip-primary', true);
    tooltip.append('text').classed('tooltip-secondary', true);

    // vertical reference line to show where the tooltip is selecting data
    g
      .append('line')
      .classed('tooltip-line', true)
      .attr('visibility', 'hidden')
      .attr('x1', 0)
      .attr('x2', 0)
      .attr('y1', 0)
      .attr('y2', height);
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
