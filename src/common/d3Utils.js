import * as d3 from 'd3';

// used by both SparkLines and Detail Line Charts
export const margin = { top: 8, right: 10, bottom: 2, left: 10 };
export const width = 240 - margin.left - margin.right;
export const height = 69 - margin.top - margin.bottom;

export const parseDate = d3.timeParse('%Y-%m');

export const xScale = d3.scaleTime().range([0, width]);

export const colorScale = d3.scaleOrdinal(d3.schemeCategory20);

export const yScale = d3.scaleLinear().range([height, 0]);

export const area = d3
  .area()
  .x(d => xScale(d.year_month))
  .y0(height)
  .y1(d => yScale(d.pedestrian_injured))
  .curve(d3.curveMonotoneX);

export const line = d3
  .line()
  .x(d => xScale(d.year_month))
  .y(d => yScale(d.pedestrian_injured))
  .curve(d3.curveMonotoneX);
