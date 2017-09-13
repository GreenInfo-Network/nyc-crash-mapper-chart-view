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

    if (dataParsed.values.length && !isEqual(prevState.dataParsed.values, dataParsed.values)) {
      this.renderChart(dataParsed.values);
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
      injuries: d3.sum(
        values,
        d => (category === 'injuries' ? d.pedestrian_injured : d.pedestrian_killed)
      ),
    });

    dataParsed.values.push({
      type: 'cyclist',
      injuries: d3.sum(
        values,
        d => (category === 'injuries' ? d.cyclist_injured : d.cyclist_killed)
      ),
    });

    dataParsed.values.push({
      type: 'motorist',
      injuries: d3.sum(
        values,
        d => (category === 'injuries' ? d.motorist_injured : d.motorist_killed)
      ),
    });

    // store a sum for the label of the bottom of the pie chart
    dataParsed.total = d3.sum(dataParsed.values, d => d.injuries);

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
    const { width, height, category } = this.props;
    const { dataParsed } = this.state;
    const { total } = dataParsed;

    return (
      <div className="PieChart">
        <svg
          width={width}
          height={height}
          ref={_ => {
            this.svg = _;
          }}
        />
        {total && (
          <p>
            Total {category}: {total}
          </p>
        )}
      </div>
    );
  }
}

export default PieChart;
