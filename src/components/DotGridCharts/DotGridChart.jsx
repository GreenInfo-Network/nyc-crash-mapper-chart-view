import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as pt from '../../common/reactPropTypeDefs';

class DotGridChart extends Component {
  static propTypes = {
    data: PropTypes.arrayOf(PropTypes.object),
    subheadHeights: PropTypes.shape({
      cyclist: PropTypes.number,
      motorist: PropTypes.number,
      pedestrian: PropTypes.number,
    }),
    startDate: pt.date.isRequired,
    endDate: pt.date.isRequired,
    radius: PropTypes.number,
    strokeWidth: PropTypes.number,
    title: PropTypes.string,
  };

  static defaultProps = {
    data: [],
    subheadHeights: {},
    radius: 3,
    strokeWidth: 1,
    title: '',
  };

  constructor(props) {
    super(props);
    this.svg = null; // ref to svg
    // chart margins
    this.margin = { top: 10, bottom: 25, left: 0, right: 10 };
    // color scale
    this.colorScale = d3
      .scaleOrdinal(['#FFDB65', '#FF972A', '#FE7B8C'])
      .domain(['pedestrian', 'cyclist', 'motorist']);
    this.formatTime = d3.timeFormat('%b %Y');
    this.formatNumber = d3.format(',');
  }

  renderGrids() {
    const { data, radius, strokeWidth, subheadHeights } = this.props;
    if (!data.length || !subheadHeights) return null;
    const colorScale = this.colorScale;
    const formatNumber = this.formatNumber;
    const translateFactor = radius + strokeWidth;

    return data.map(datum => {
      const { grid, gridWidth, key, killed, injured, killedTotal, injuredTotal } = datum;
      const personType = key;

      // TO DO: replace SVG with Canvas? Boroughs take a while to render...
      return (
        <div className="person-type-grids" key={personType}>
          {killed.length > 0 && <h6>{`${personType} killed: ${formatNumber(killedTotal)}`}</h6>}
          {injured.length > 0 && <h6>{`${personType} injured: ${formatNumber(injuredTotal)}`}</h6>}
          <svg width={gridWidth} height={subheadHeights[personType] + 10}>
            <g transform={`translate(${translateFactor}, ${translateFactor})`}>
              {grid.map((d, i) => (
                <circle
                  key={i}
                  cx={d.x}
                  cy={d.y}
                  r={radius}
                  stroke={colorScale(personType)}
                  strokeWidth={strokeWidth}
                  fill={i + 1 <= killedTotal ? colorScale(personType) : 'none'}
                />
              ))}
            </g>
          </svg>
        </div>
      );
    });
  }

  render() {
    const { data } = this.props;
    const { startDate, endDate, title } = this.props;

    return (
      <div className="DotGridChart">
        {data.length > 0 && (
          <div className="dot-grid-title">
            <h6 className="period">{title}</h6>
            <h6 className="date-range">
              {`${this.formatTime(startDate)} – ${this.formatTime(endDate)}`}
            </h6>
          </div>
        )}
        {this.renderGrids()}
      </div>
    );
  }
}

export default DotGridChart;
