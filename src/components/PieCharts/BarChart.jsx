import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import * as pt from '../../common/reactPropTypeDefs';
import { crashTypeDisplay, crashValueDisplay } from '../../common/labelFormatters';

const entityTypes = ['motorist', 'cyclist', 'pedestrian'];
const colorList = {
  motorist: '#D96246',
  cyclist: '#FF972A',
  pedestrian: '#FFDB65',
};
class BarChart extends Component {
  static propTypes = {
    id: PropTypes.string.isRequired,
    barChartWidth: PropTypes.number,
    barChartHeight: PropTypes.number,
    barChartValues: pt.barChartData,
    damageType: PropTypes.string.isRequired,
  };

  static defaultProps = {
    barChartWidth: 30,
    barChartHeight: 200,
    barChartValues: {},
  };

  componentDidMount() {
    // if the app loaded with pre-fetched data OR if the user toggled between 'trend' and 'compare'
    // make sure to create and update the chart
  }

  componentDidUpdate() {
    this.updateChart();
  }

  updateChart() {
    const { barChartValues, barChartWidth, barChartHeight } = this.props;

    const initStackedBarChart = {
      draw(config) {
        const { element: containerId, key: stackKey, data, damageType } = config;
        const isEmpty = data.length === 0 || data.every(value => value === 0);
        d3.select(`#${containerId}`)
          .selectAll('svg')
          .remove();
        if (isEmpty) {
          this.drawEmptyBarChart(containerId, damageType);
        } else {
          this.drawStackedBarChart(containerId, stackKey, data);
        }
      },

      drawStackedBarChart(containerId, stackKey, data) {
        const width = barChartWidth;
        const height = barChartHeight;
        const total = data.reduce((sum, value) => sum + value, 0);
        const rate = height / total;
        const colors = stackKey.map(
          key => colorList[entityTypes.find(entityType => key.includes(entityType))]
        );
        const svg = d3
          .select(`#${containerId}`)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .append('g');

        d3.select(`#${containerId}`)
          .selectAll('div.tooltip')
          .each(function handle() {
            d3.select(this).remove();
          });

        const tooltip = d3
          .select(`#${containerId}`)
          .append('div')
          .attr('class', 'tooltip')
          .style('display', 'none');
        const rect = svg
          .selectAll('rect')
          .data(data)
          .enter()
          .append('rect')
          .attr('height', d => d * rate)
          .attr('y', (d, i) => data.slice(0, i).reduce((sum, value) => sum + value, 0) * rate)
          .attr('fill', (d, i) => colors[i])
          .attr('x', 0)
          .attr('width', width);

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

        rect.each(function handleData(d, i) {
          d3.select(this).on('mousemove', () => {
            tooltip
              .text(
                `${crashValueDisplay(d)} ${crashTypeDisplay(stackKey[i])} (${crashValueDisplay(
                  (100 * d) / total
                )}%)`
              )
              .style('left', `${d3.event.pageX + 10}px`)
              .style('top', `${d3.event.pageY + 10}px`);
          });
        });
      },

      drawEmptyBarChart(containerId, damageType) {
        const width = barChartWidth;
        const height = barChartHeight;
        const svg = d3
          .select(`#${containerId}`)
          .append('svg')
          .attr('width', width)
          .attr('height', height)
          .style('overflow', 'visible');
        svg
          .append('rect')
          .attr('x', 0)
          .attr('y', 0)
          .attr('width', width)
          .attr('height', height)
          .attr('fill', '#3D3D3D')
          .style('stroke', '#FFe115')
          .style('stroke-width', '1px');
        const tooltip = d3
          .select(`#${containerId}`)
          .append('div')
          .style('position', 'absolute')
          .style('visibility', 'hidden')
          .text(`0 ${crashTypeDisplay(damageType)}`)
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
      },
    };

    const sortedKeys = Object.keys(barChartValues).sort((a, b) => {
      const aIndex = entityTypes.findIndex(entityType => a.includes(entityType));
      const bIndex = entityTypes.findIndex(entityType => b.includes(entityType));
      return aIndex > bIndex ? 1 : -1;
    });
    const sortedValues = sortedKeys.map(key => barChartValues[key]);
    initStackedBarChart.draw({
      key: sortedKeys,
      data: sortedValues,
      element: this.props.id,
      damageType: this.props.damageType,
    });
  }

  render() {
    const { id } = this.props;

    return <div className="barChart" id={id} />;
  }
}

export default BarChart;
