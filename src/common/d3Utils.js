import * as d3 from 'd3';

export const parseDate = d3.timeParse('%Y-%m');
export const formatDate = d3.timeFormat('%b %Y');
