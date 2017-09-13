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

  componentDidUpdate(prevProps, prevState) {
    const { dataParsed } = this.state;

    if (this.props.values && !isEqual(prevProps.values, this.props.values)) {
      this.parseData(this.props.values);
    }

    if (dataParsed.values.length && !prevState.dataParsed.values.length) {
      this.renderChart(dataParsed.values);
    }

    if (dataParsed.values.length && !isEqual(dataParsed.values, prevState.dataParsed.values)) {
      this.update();
    }

    if (prevState.dataParsed.values.length && !dataParsed.values.length) {
      // TO DO: handle no data after there was data
    }
  }

  parseData(values) {
    // create a new data structure to pass to the pie chart
    const { category } = this.props;
    const dataParsed = {
      values: [],
      total: null,
    };

    dataParsed.values.push({
      type: 'pedestrian',
      amount: d3.sum(
        values,
        d => (category === 'injuries' ? d.pedestrian_injured : d.pedestrian_killed)
      ),
    });

    dataParsed.values.push({
      type: 'cyclist',
      amount: d3.sum(values, d => (category === 'injuries' ? d.cyclist_injured : d.cyclist_killed)),
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

    // re-render to render piechart
    this.setState({
      dataParsed,
    });
  }

  destroyChart() {
    d3
      .select(this.svg)
      .select('g')
      .remove();
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

  renderChart(data) {
    const { width, height } = this.props;
    const radius = this.radius;

    const g = d3
      .select(this.svg)
      .append('g')
      .attr('transform', `translate(${width / 2}, ${height / 2})`);

    // ped, cyclist, motorist
    const color = d3.scaleOrdinal(['#68ADD8', '#FF8D2F', '#969696']);

    const pie = d3
      .pie()
      .sort(null)
      .value(d => d.amount);

    const dataPie = pie(data);

    const arc = d3
      .arc()
      .outerRadius(radius)
      .innerRadius(0);

    g
      .selectAll('path')
      .data(dataPie, d => d.data.type)
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
        {total && <h6 className="title">{title}</h6>}
        <svg
          width={width}
          height={height}
          ref={_ => {
            this.svg = _;
          }}
        />
        <p>{total}</p>
      </div>
    );
  }
}

export default PieChart;
