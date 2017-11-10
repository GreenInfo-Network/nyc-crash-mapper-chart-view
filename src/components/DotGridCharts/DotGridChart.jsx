import React from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { formatNumber } from '../../common/d3Utils';
import SvgCyclist from '../../../assets/icons/bicycling.svg';
import SvgMotorist from '../../../assets/icons/motorist.svg';
import SvgPedestrain from '../../../assets/icons/pedestrian.svg';

const IconCyclist = props => <SvgCyclist {...props} />;
const IconMotorist = props => <SvgMotorist {...props} />;
const IconPedestrian = props => <SvgPedestrain {...props} />;

function personTypeIcon(personType) {
  switch (personType) {
    case 'cyclist':
      return IconCyclist;

    case 'motorist':
      return IconMotorist;

    case 'pedestrian':
      return IconPedestrian;

    default:
      return null;
  }
}

// Actual component that renders the SVG DotGrid Chart
const DotGridChart = props => {
  const { personType, radius, strokeWidth, data } = props;

  if (!data || !data.grid) return null;

  const { grid, gridWidth, gridHeight, killedTotal, injuredTotal } = data;

  // color scale
  const colorScale = d3
    .scaleOrdinal(['#FFDB65', '#FF972A', '#FE7B8C'])
    .domain(['pedestrian', 'cyclist', 'motorist']);
  // offset of SVG group element
  const translateFactor = radius + strokeWidth;

  const PersonIcon = personTypeIcon(personType);

  // For the total injured / killed headers, we hide them if there's no data so that things stay aligned vertically
  const injuredTotalStyle = {
    visibility: injuredTotal >= 0 ? 'visible' : 'hidden',
  };
  const killedTotalStyle = {
    visibility: killedTotal >= 0 ? 'visible' : 'hidden',
  };

  // TO DO: replace SVG with Canvas? Boroughs take a while to render...
  return (
    <div className="DotGridChart">
      <div>
        <PersonIcon className="PersonIcon" width="35px" height="35px" />
        <div style={{ display: 'inline-block' }}>
          <h6 style={killedTotalStyle}>{`${personType} killed: ${formatNumber(killedTotal)}`}</h6>
          <h6 style={injuredTotalStyle}>
            {`${personType} injured: ${formatNumber(injuredTotal)}`}
          </h6>
        </div>
      </div>
      <svg width={gridWidth} height={gridHeight + 10}>
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
};

DotGridChart.propTypes = {
  personType: PropTypes.string.isRequired,
  radius: PropTypes.number,
  strokeWidth: PropTypes.number,
  data: PropTypes.shape({}),
};

DotGridChart.defaultProps = {
  radius: 5,
  strokeWidth: 2,
  data: {},
};

export default DotGridChart;
