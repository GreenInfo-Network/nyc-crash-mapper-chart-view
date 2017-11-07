// This Module contains style variables shared both by JS & SCSS
// it can't be exported as an ES6 module as it is used by Webpack loaders and not transpiled by Babel
// NOTE: altering these variables while running the webpack dev server will mean that they won't update in SCSS
// this seems to be a limitation of the Webpack sass-vars-loader
module.exports = {
  'app-column-right': 300,
  // primary, secondary, and reference entity colors
  'primary-color': '#FFF1B3',
  'secondary-color': '#FFDAEB',
  'reference-color': '#AFE2CE',
  // width of the rank legend container
  'rank-legend-width': 170,
  // colors for defining stops in the sparkline gradient's fill & rank view legend
  'sparkline-color-1': '#f03b20',
  'sparkline-color-2': '#feb24c',
  'sparkline-color-3': '#ffeda0',
  // default width and height of line chart tooltip
  'linechart-tooltip-w': 190,
  'linechart-tooltip-h': 50,
};
