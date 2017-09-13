import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import isEqual from 'lodash/isEqual';

class PieChart extends Component {
  static propTypes = {
    width: PropTypes.number.isRequired,
    height: PropTypes.number.isRequired,
    data: PropTypes.shape({
      values: PropTypes.arrayOf(PropTypes.object),
      total: PropTypes.number,
    }),
  };

  static defaultProps = {
    data: {},
  };

  constructor(props) {
    super(props);
    const { width, height } = props;
    this.radius = Math.min(width, height) / 2;
    this.svg = null; // ref to the svg element
  }

  componentDidUpdate(prevProps) {
    if (this.props.data.values && !isEqual(prevProps.data.values, this.props.data.values)) {
      this.renderChart(this.props.data.values);
    }
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
      .value(d => d.injuries);

    const path = d3
      .arc()
      .outerRadius(this.radius - 10)
      .innerRadius(0);

    const label = d3
      .arc()
      .outerRadius(radius - 40)
      .innerRadius(radius - 40);

    const arc = g
      .selectAll('.arc')
      .data(pie(data))
      .enter()
      .append('g')
      .attr('class', 'arc');

    arc
      .append('path')
      .attr('d', path)
      .attr('fill', d => color(d.data.type));

    arc
      .append('text')
      .attr('transform', d => `translate(${label.centroid(d)})`)
      .attr('dy', '0.35em')
      .text(d => d.data.type);
  }

  render() {
    const { width, height, data } = this.props;
    const { total } = data;

    return (
      <div className="PieChart">
        <svg
          width={width}
          height={height}
          ref={_ => {
            this.svg = _;
          }}
        />
        <p>Total Injuries: {total}</p>
      </div>
    );
  }
}

export default PieChart;
