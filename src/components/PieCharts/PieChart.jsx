import React, { Component } from 'react';
import * as d3 from 'd3';

import PropTypes from 'prop-types';
import * as pt from '../../common/reactPropTypeDefs';
import { crashTypeDisplay, crashValueDisplay } from '../../common/labelFormatters';

const Cyclist = '../../../assets/icons/cyclist.png';
const Motorist = '../../../assets/icons/motorist.png';
const Pedestrain = '../../../assets/icons/pedestrian.png';
const personTypeColors = {
  motorist: '#D96246',
  cyclist: '#FF972A',
  pedestrian: '#FFDB65',
};
const vehicleColors = [
  '#A1CA5D', // bike
  '#89CCBC', // Motorcycle
  '#7CC5DB', // bus
  '#69B883', // e-bike
  '#349093', // car
  '#51787C', // Suv
  '#4A94CA', // Truck
  '#898989', // other
];

function personTypeIcon(personType) {
  switch (personType) {
    case 'cyclist':
      return Cyclist;

    case 'motorist':
      return Motorist;

    case 'pedestrian':
      return Pedestrain;

    default:
      return null;
  }
}

class PieClass extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    pieChartRadius: PropTypes.number,
    pieChartValues: pt.pieChartData,
    personType: PropTypes.string.isRequired,
    damageType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    pieChartRadius: 50,
    pieChartValues: {},
  };

  constructor(props) {
    super(props);
    this.createPie = d3
      .pie()
      .value(d => d.value)
      .sort(null);
    this.createArc = d3
      .arc()
      .innerRadius(0)
      .outerRadius(props.pieChartRadius);
    this.format = d3.format('.2f');
    this.state = {
      total: 0,
    };
  }

  componentDidMount() {
    const { pieChartValues, personType, id, pieChartRadius } = this.props;
    const pieChartId = `${personType}_${id}`;
    const chartValues = Object.keys(pieChartValues)
      .filter(key => key.includes(personType))
      .reduce((data, key) => {
        data[key] = pieChartValues[key];
        return data;
      }, {});
    const formattedData = Object.entries(chartValues).map(([key, value]) => ({ key, value }));
    const data = this.createPie(formattedData);
    const outerRadius = pieChartRadius;

    const svg = d3
      .select(`#${pieChartId}`)
      .append('svg')
      .attr('class', 'chart')
      .attr('width', 2 * pieChartRadius)
      .attr('height', 2 * pieChartRadius);
    const group = svg.append('g').attr('transform', `translate(${outerRadius} ${outerRadius})`);

    const groupWithEnter = group
      .selectAll('g.arc')
      .data(data)
      .enter();

    const path = groupWithEnter.append('g').attr('class', 'arc');

    path
      .append('path')
      .attr('class', 'arc')
      .attr('d', this.createArc)
      .attr('fill', d => vehicleColors[d.index]);
  }

  componentWillReceiveProps(nextProps) {
    const { pieChartValues, personType } = nextProps;
    const chartValues = Object.keys(pieChartValues)
      .filter(key => key.includes(personType))
      .reduce((data, key) => {
        data[key] = pieChartValues[key];
        return data;
      }, {});
    const formattedData = Object.entries(chartValues).map(([key, value]) => ({ key, value }));
    const data = this.createPie(formattedData);
    let t = 0;
    data.forEach(d => {
      t += d.value;
    });
    this.setState({
      total: t,
    });
  }

  componentDidUpdate() {
    const { pieChartValues, personType, id } = this.props;
    const pieChartId = `${personType}_${id}`;
    const chartValues = Object.keys(pieChartValues)
      .filter(key => key.includes(personType))
      .reduce((data, key) => {
        data[key] = pieChartValues[key];
        return data;
      }, {});
    const formattedData = Object.entries(chartValues).map(([key, value]) => ({ key, value }));
    const data = this.createPie(formattedData);
    const isAllZero = data.every(item => item.value === 0);
    if (isAllZero) {
      this.drawEmptyCircle(pieChartId);
    } else {
      this.drawPieChart(pieChartId, data);
    }
  }

  drawPieChart(pieChartId, data) {
    const { total } = this.state;
    d3.select(`#${pieChartId}`)
      .selectAll('circle')
      .remove();
    let svg = {};
    svg = d3.select(`#${pieChartId}`).select('svg');
    const tooltip = d3
      .select(`#${pieChartId}`)
      .append('div')
      .attr('class', 'tooltip')
      .style('display', 'none');

    const group = svg
      .select('g')
      .selectAll('g.arc')
      .data(data);

    svg.on('mouseover', () => {
      tooltip
        .style('display', 'inline-block')
        .style('position', 'absolute')
        .style('opacity', 0.8)
        .style('font-size', '10px')
        .style('padding', '7px 7px')
        .style('background-color', '#5E5E5E')
        .style('border-radius', '3px')
        .style('font-size', '10px');
    });

    svg.on('mouseout', () => {
      tooltip.style('display', 'none');
    });

    group.exit().remove();

    const groupWithUpdate = group
      .enter()
      .append('g')
      .attr('class', 'arc');

    const path = groupWithUpdate.append('path').merge(group.select('path.arc'));

    path
      .attr('class', 'arc')
      .attr('d', this.createArc)
      .attr('fill', (d, i) => vehicleColors[i]);

    const pathList = svg.select('g').selectAll('path');
    pathList.each(function handleData(pathData) {
      d3.select(this).on('mousemove', () => {
        tooltip
          .text(
            `${crashValueDisplay(pathData.data.value)} ${crashTypeDisplay(
              pathData.data.key
            )} (${crashValueDisplay((100 * pathData.data.value) / total)}%)`
          )
          .style('left', `${d3.event.pageX + 10}px`)
          .style('top', `${d3.event.pageY + 10}px`);
      });
    });
  }

  drawEmptyCircle(pieChartId) {
    const { personType, damageType, pieChartRadius } = this.props;
    d3.select(`#${pieChartId}`)
      .selectAll('g.arc')
      .selectAll('circle')
      .remove();
    let svg = {};
    svg = d3.select(`#${pieChartId}`).select('svg');
    svg
      .append('circle')
      .attr('id', 'circleTooltip')
      .attr('cx', pieChartRadius)
      .attr('cy', pieChartRadius)
      .attr('r', pieChartRadius - 1)
      .attr('fill', '#3D3D3D')
      .style('stroke', personTypeColors[personType])
      .style('stroke-width', '1px');

    // create a tooltip
    const tooltip = d3
      .select(`#${pieChartId}`)
      .append('div')
      .style('position', 'absolute')
      .style('visibility', 'hidden')
      .text(`0 ${crashTypeDisplay(personType)} ${crashTypeDisplay(damageType)} (0%)`)
      .style('opacity', 0.8)
      .style('font-size', '10px')
      .style('padding', '7px 7px')
      .style('background-color', '#5E5E5E')
      .style('border-radius', '3px')
      .style('font-size', '10px');

    svg.on('mouseover', () => tooltip.style('visibility', 'visible'));
    svg.on('mousemove', () =>
      tooltip.style('top', `${d3.event.pageY + 10}px`).style('left', `${d3.event.pageX + 10}px`)
    );
    svg.on('mouseout', () => tooltip.style('visibility', 'hidden'));
  }

  render() {
    const { personType, id } = this.props;
    const { total } = this.state;
    const pieChartId = `${personType}_${id}`;
    const PersonIcon = personTypeIcon(personType);
    return (
      <div className="PieChart" id={pieChartId}>
        <div className="person-icon" style={{ background: personTypeColors[personType] }}>
          <img src={PersonIcon} alt={personType} />
        </div>
        <div className="total" style={{ background: personTypeColors[personType] }}>
          {total.toFixed(0)}
        </div>
      </div>
    );
  }
}

export default PieClass;
