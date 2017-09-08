import * as d3 from 'd3';

export default function() {
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
    .domain([new Date(2011, 8, 1), new Date()])
    .range([0, width]);

  let svg = null;
  let gBrushes = null; // brushes container
  const brushes = []; // keep track of existing brushes

  function drawBrushes() {
    const brushSelection = gBrushes.selectAll('.brush').data(brushes, d => d.id);

    // setup new brushes
    brushSelection
      .enter()
      .insert('g', '.brush')
      .attr('class', 'brush')
      .attr('id', brush => `brush-${brush.id}`)
      // eslint-disable-next-line
      .each(function(brushObject) {
        brushObject.brush(d3.select(this));
      });

    // remove pointer events on brush overlays
    // eslint-disable-next-line
    brushSelection.each(function(brushObject) {
      d3
        .select(this)
        .attr('class', 'brush')
        .selectAll('.overlay')
        .style('pointer-events', () => {
          const brush = brushObject.brush;
          if (brushObject.id === brushes.length - 1 && brush !== undefined) {
            return 'all';
          }
          return 'none';
        });
    });

    brushSelection.exit().remove();
  }

  function newBrush() {
    const brush = d3
      .brushX()
      .extent([[0, 0], [width, height]])
      // eslint-disable-next-line
      .on('end', brushended);

    brushes.push({ id: brushes.length, brush });

    function brushended() {
      const lastBrushID = brushes[brushes.length - 1].id;
      const lastBrush = document.getElementById(`brush-${lastBrushID}`);
      const selection = d3.brushSelection(lastBrush);

      if (selection && selection[0] !== selection[1]) {
        newBrush();
      }

      drawBrushes();
    }
  }

  // set's up the timeline, adds a new brush
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

    gBrushes = svg.append('g').attr('class', 'brushes');

    newBrush();
    newBrush();
    drawBrushes();
  }

  return init;
}
