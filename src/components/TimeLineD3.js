import * as d3 from 'd3';

/**
 * Function that sets up the D3 brushes for selecting two separate date ranges
 * @param {object} callbacks: callback functions for brush 1 and brush 2 that are
 * invoked on brushend
 * @param {object} dateRanges: two sets of start and end dates that are used to set the brushes
 * initial values
 */
export default function(callbacks, dateRanges) {
  const { onBrushOneEnd, onBrushTwoEnd } = callbacks;
  const { dateRangeOne, dateRangeTwo } = dateRanges;

  const margin = {
    top: 10,
    right: 10,
    bottom: 40,
    left: 10,
  };
  let width = 960 - margin.left - margin.right;
  let height = 100 - margin.top - margin.bottom;

  const xScale = d3.scaleTime().domain([new Date(2011, 7, 1), new Date()]);

  const axisMinor = d3
    .axisBottom()
    .scale(xScale)
    .ticks(d3.timeMonth.every(2))
    .tickSize(-height)
    .tickFormat('');

  const axisMajor = d3
    .axisBottom()
    .scale(xScale)
    .ticks(d3.timeYear.every(1))
    .tickPadding(0);

  let svg = null;
  let gBrushes = null; // brushes svg group

  // keep track of existing brushes, probably don't need an array here, some code was borrowed
  // from an example demoing how to add infinite number of brushes to a viz...
  const brushes = [];

  // invoked on the "end" event of a d3-brush (user stops dragging or resizing the brush)
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
      // eslint-disable-next-line
      .on('brush', function() {
        const brushG = d3.select(this);
        const rect = brushG.node().querySelector('rect.selection'); // can't use d3.select() here
        const rWidth = +rect.getAttribute('width');
        const xPos = +rect.getAttribute('x');
        const text = brushG.select('text');
        if (text.node()) {
          text.attr('x', xPos + rWidth / 2 - 36).attr('y', height / 2 + 5);
        }
      })
      .on('end', () => brushend(onEndCallback));

    // add the brush to the brushes array so it can be altered programmatically
    brushes.push({ id: brushes.length, brush });

    return brush;
  }

  // set's up the timeline, adds a new brush
  // @param {node} el: element representing the SVG node for d3 to hook into
  function init(el) {
    xScale.range([0, width]);

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
      .call(axisMinor)
      .selectAll('.tick')
      .classed('minor', d => d.getMonth());

    svg
      .append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${height})`)
      .call(axisMajor)
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

        // create and position the brush's label
        const brushG = d3.select(this);
        const rect = brushG.node().querySelector('rect.selection');
        const rWidth = +rect.getAttribute('width');
        const xPos = +rect.getAttribute('x');
        const text = brushG.insert('text', ':first-child');
        text
          .attr('x', xPos + rWidth / 2 - 36)
          .attr('y', height / 2 + 5)
          .attr('class', 'brush-label');

        // set some default values of the brushes
        if (brushObj.id === 0) {
          brushObj.brush.move(d3.select(this), [
            xScale(dateRangeOne.startDate),
            xScale(dateRangeOne.endDate),
          ]);
          // create label text for period one
          text.text('Period One');
        } else {
          brushObj.brush.move(d3.select(this), [
            xScale(dateRangeTwo.startDate),
            xScale(dateRangeTwo.endDate),
          ]);
          // create label text for period two
          text.text('Period Two');
        }
      });

    // remove pointer events on each brushes overlay, this prevents new brushes from being made
    d3.selectAll('.overlay').style('pointer-events', 'none');
  }

  // eslint-disable-next-line
  const getSetHeight = value => {
    if (arguments.length) {
      height = value - margin.top - margin.bottom;
    } else {
      return height;
    }
  };

  // eslint-disable-next-line
  const getSetWidth = value => {
    if (arguments.length) {
      width = value - margin.left - margin.right;
    } else {
      return width;
    }
  };

  // method that responds to a browser resize
  const resize = curDateRanges => {
    // eslint-disable-next-line
    const { dateRangeOne, dateRangeTwo } = curDateRanges;
    // transition selection, this animates everything smoothly
    const t = svg.transition().duration(750);

    // update xScale range
    xScale.range([0, width]);
    axisMinor.scale(xScale);
    axisMajor.scale(xScale);

    // resize background rect
    t.select('.grid-background').attr('width', width);

    // update minor axis
    t.select('.x.grid').call(axisMinor);

    // update major axis
    t
      .select('.x.axis')
      .call(axisMajor)
      .selectAll('text')
      .attr('x', 0)
      .attr('y', 10)
      .style('text-anchor', null);

    // update brushes' extent & position
    brushes.forEach(brushObj => {
      brushObj.brush.extent([[0, 0], [width, height]]);

      if (brushObj.id === 0) {
        brushObj.brush.move(t.select('#brush-0'), [
          xScale(dateRangeOne.startDate),
          xScale(dateRangeOne.endDate),
        ]);
      } else {
        brushObj.brush.move(t.select('#brush-1'), [
          xScale(dateRangeTwo.startDate),
          xScale(dateRangeTwo.endDate),
        ]);
      }
    });
  };

  return {
    init,
    getSetWidth,
    getSetHeight,
    resize,
  };
}
