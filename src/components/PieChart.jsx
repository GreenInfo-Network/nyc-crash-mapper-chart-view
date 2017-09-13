import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import isEqual from 'lodash/isEqual';

class PieChart extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    values: PropTypes.arrayOf(PropTypes.object),
    category: PropTypes.oneOf(['injuries', 'fatalities']).isRequired,
  };

  static defaultProps = {
    values: [],
  };

  constructor(props) {
    super(props);
    const { width, height } = props;
    this.radius = Math.min(width, height) / 2;
    this.svg = null; // ref to the svg element
    this.state = {
      dataParsed: {
        values: [],
        sum: null,
      },
    };
  }

  componentDidMount() {
    this.initChart();
    this.placeholder();
  }

  componentDidUpdate(prevProps, prevState) {
    const { dataParsed } = this.state;

    if (!isEqual(this.props.values, prevProps.values)) {
      this.parseData(this.props.values);
    }

    if (dataParsed.values.length && !prevState.dataParsed.values.length) {
      this.renderChart(dataParsed.values);
    }

    if (dataParsed.values.length && !isEqual(dataParsed.values, prevState.dataParsed.values)) {
      this.update();
    }

    if (prevState.dataParsed.values.length && !dataParsed.values.length) {
      // if no data, then show a placeholder chart
      this.placeholder();
    }
  }

  parseData(values) {
    // create a new data structure to pass to the pie chart
    // total is used for the label below the chart
    const { category } = this.props;
    const dataParsed = {
      values: [],
      total: null,
    };

    // only parse data that exists
    if (values.length) {
      dataParsed.values.push({
        type: 'pedestrian',
        amount: d3.sum(
          values,
          d => (category === 'injuries' ? d.pedestrian_injured : d.pedestrian_killed)
        ),
      });

      dataParsed.values.push({
        type: 'cyclist',
        amount: d3.sum(
          values,
          d => (category === 'injuries' ? d.cyclist_injured : d.cyclist_killed)
        ),
      });

      dataParsed.values.push({
        type: 'motorist',
        amount: d3.sum(
          values,
          d => (category === 'injuries' ? d.motorist_injured : d.motorist_killed)
        ),
      });

      // store a sum for the label of the bottom of the pie chart
      dataParsed.total = d3.sum(dataParsed.values, d => d.amount);
    }

    // re-render to render piechart
    this.setState({
      dataParsed,
    });
  }

  placeholder() {
    // render a grey placeholder circle when no data is present
    const tau = 2 * Math.PI;
    const svg = d3.select(this.svg);
    const arc = d3
      .arc()
      .outerRadius(this.radius)
      .innerRadius(0)
      .startAngle(0);

    // remove any existing paths
    svg.selectAll('path').remove();

    // add the placeholder circle
    svg
      .select('g')
      .append('path')
      .datum({ endAngle: tau })
      .style('fill', '#ddd')
      .attr('d', arc);
  }

  update() {
    // updates existing chart using a custom tween to animate the transition between chart states
    const { dataParsed } = this.state;
    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.amount)(dataParsed.values);

    const arc = d3
      .arc()
      .outerRadius(this.radius)
      .innerRadius(0);

    const path = d3
      .select(this.svg)
      .selectAll('path')
      .data(pie);

    function arcTween(a) {
      const i = d3.interpolate(this._current, a);
      this._current = i(0);
      return t => arc(i(t));
    }

    path
      .transition()
      .duration(750)
      .attrTween('d', arcTween);
  }

  initChart() {
    // set up the barebone structure of the chart, a svg group centered vert & horz
    const { width, height } = this.props;
    d3
      .select(this.svg)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);
  }

  renderChart(data) {
    const radius = this.radius;
    const g = d3.select(this.svg).select('g');

    // remove the placeholder path
    g.select('path').remove();

    // colors stand for: ped, cyclist, motorist
    const color = d3.scaleOrdinal(['#68ADD8', '#FF8D2F', '#969696']);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.amount);

    // pie is a layout function which returns angles for arcs from input data
    const pieLayout = pie(data);

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(0);

    g
      .selectAll('path')
      .data(pieLayout, d => d.data.type)
      .enter()
      .append('path')
      .attr('d', arc)
      .attr('fill', d => color(d.data.type))
      .attr('class', 'arc')
      .each(d => {
        this._current = d; // store initial angle
      });
  }

  render() {
    const { width, height, category } = this.props;
    const { dataParsed } = this.state;
    const { total } = dataParsed;
    const title = category === 'injuries' ? 'Injury' : 'Fatality';

    return (
      <div className="PieChart">
        <h6 className="title">{title || ''}</h6>
        <svg
          width={width}
          height={height}
          ref={_ => {
            this.svg = _;
          }}
        />
        <p>{total || ''}</p>
      </div>
    );
  }
}

export default PieChart;
