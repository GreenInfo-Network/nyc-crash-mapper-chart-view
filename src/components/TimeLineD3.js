import * as d3 from 'd3';

/**
 * Function that sets up the D3 brushes for selecting two separate date ranges
 * @param {object} callbacks: callback functions for brush 1 and brush 2 that are
 * invoked on brushend
 */
export default function(callbacks) {
  const { onBrushOneEnd, onBrushTwoEnd } = callbacks;

  const margin = {
    top: 10,
    right: 0,
    bottom: 20,
    left: 0,
  };
  const width = 960 - margin.left - margin.right;
  const height = 100 - margin.top - margin.bottom;

  const xScale = d3
    .scaleTime()
    .domain([new Date(2011, 7, 1), new Date()])
    .range([0, width]);

  let svg = null;
  let gBrushes = null; // brushes container
  const brushes = []; // keep track of existing brushes

  // invoked on the "end" event of a d3-brush
  // @param {function} callback: function that is invoked on the brush's "end" event
  function brushend(callback) {
    if (!d3.event.sourceEvent) return; // Only transition after input.
    if (!d3.event.selection) return; // Ignore empty selections.
    const d0 = d3.event.selection.map(xScale.invert);
    const d1 = d0.map(d3.timeMonth.round);

    // If empty when rounded, use floor & ceil instead.
    if (d1[0] >= d1[1]) {
      d1[0] = d3.timeMonth.floor(d0[0]);
      d1[1] = d3.timeMonth.offset(d1[0]);
    }

    d3
      .select(this)
      .transition()
      .call(d3.event.target.move, d1.map(xScale));

    if (callback && typeof callback === 'function') {
      // invoke the date range action creators with the array of start and end dates
      callback(d1);
    }
  }

  // creates a new d3-brush, the object responsible for creating the rectangles on top of
  // the timeline that respond to dragging and resizing
  // @param {function} onEndCallback: callback function that is invoked on the brush's "end" event
  function makeBrush(onEndCallback) {
    const brush = d3
      .brushX()
      .extent([[0, 0], [width, height]])
      .on('end', () => brushend(onEndCallback));

    // add the brush to the brushes array so it can be altered programmatically
    brushes.push({ id: brushes.length, brush });

    return brush;
  }

  // set's up the timeline, adds a new brush
  // @param {node} el: element representing the SVG node for d3 to hook into
  function init(el) {
    svg = d3
      .select(el)
      .append('g')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    svg
      .append('rect')
      .attr('class', 'grid-background')
      .attr('width', width)
      .attr('height', height);

    svg
      .append('g')
      .attr('class', 'x grid')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .ticks(d3.timeMonth.every(2))
          .tickSize(-height)
          .tickFormat('')
      )
      .selectAll('.tick')
      .classed('minor', d => d.getMonth());

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(
        d3
          .axisBottom()
          .scale(xScale)
          .ticks(d3.timeYear.every(1))
          .tickPadding(0)
      )
      .selectAll('text')
      .attr('x', 0)
      .attr('y', 10)
      .style('text-anchor', null);

    // svg group that houses the indvidual brush groups
    gBrushes = svg.append('g').attr('class', 'brushes');

    // make a couple brushes
    makeBrush(onBrushOneEnd);
    makeBrush(onBrushTwoEnd);

    // bind each brush object from the brushes array, creating an empty selection
    const brushSelection = gBrushes.selectAll('.brush').data(brushes, d => d.id);

    // create the brushes individual svg groups, instantiate them, and set their initial date values
    brushSelection
      .enter()
      .insert('g', '.brush')
      .attr('class', 'brush')
      .attr('id', d => `brush-${d.id}`)
      // eslint-disable-next-line
      .each(function(brushObj) {
        // this init's the brush
        brushObj.brush(d3.select(this));

        // set some default values of the brushes
        if (brushObj.id === 0) {
          brushObj.brush.move(d3.select(this), [
            xScale(new Date(2016, 7, 1)),
            xScale(new Date(2017, 7, 1)),
          ]);
        } else {
          brushObj.brush.move(d3.select(this), [
            xScale(new Date(2012, 7, 1)),
            xScale(new Date(2013, 7, 1)),
          ]);
        }
      });

    // remove pointer events on each brushes overlay, this prevents new brushes from being made
    d3.selectAll('.overlay').style('pointer-events', 'none');
  }

  return init;
}
