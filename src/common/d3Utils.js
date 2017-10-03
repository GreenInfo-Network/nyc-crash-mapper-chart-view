import * as d3 from 'd3';

// Commonly shared d3 functions with different charts
export const margin = { top: 8, right: 10, bottom: 2, left: 10 };
export const width = 240 - margin.left - margin.right;
export const height = 69 - margin.top - margin.bottom;

export const parseDate = d3.timeParse('%Y-%m');
export const formatDate = d3.timeFormat('%b %Y');

// NOTE that trying to share some d3 functions will result in unexpected behavior
// need to figure out a work around, such as exporting functions that create d3 functions?
// does this even make sense to do?
export const xScale = () => d3.scaleTime().range([0, width]);
export const yScale = () => d3.scaleLinear().range([height, 0]);
export const colorScale = () => d3.scaleOrdinal(d3.schemeCategory20);

export function areaGenerator(accessor) {
  return d3
    .area()
    .x(d => xScale(d.year_month))
    .y0(height)
    .y1(d => yScale(d[accessor]))
    .curve(d3.curveMonotoneX);
}

export function lineGenerator(accessor) {
  return d3
    .line()
    .x(d => xScale(d.year_month))
    .y(d => yScale(d[accessor]))
    .curve(d3.curveMonotoneX);
}
