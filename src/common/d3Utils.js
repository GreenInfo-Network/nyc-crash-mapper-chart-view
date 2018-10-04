import * as d3 from 'd3';

export const parseDate = d3.timeParse('%Y-%m');
export const formatDate = d3.timeFormat('%b %Y');
export const formatDateYM = d3.timeFormat('%Y-%m');
export const formatNumber = d3.format(',');
export const formatDateYear = d3.timeFormat('%Y');
export const formatDateMonth = d3.timeFormat('%m');

export const findDateDiffInMonths = (date1, date2) => {
  const d1 = 12 * parseInt(formatDateYear(date1), 10) + parseInt(formatDateMonth(date1), 10);
  const d2 = 12 * parseInt(formatDateYear(date2), 10) + parseInt(formatDateMonth(date2), 10);
  return Math.abs(d2 - d1);
};
