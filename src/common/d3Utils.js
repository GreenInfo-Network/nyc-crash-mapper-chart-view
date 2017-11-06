import * as d3 from 'd3';

export const parseDate = d3.timeParse('%Y-%m');
export const formatDate = d3.timeFormat('%b %Y');
export const formatDateYM = d3.timeFormat('%Y-%m');
export const formatNumber = d3.format(',');
