import React from 'react';
import { scaleOrdinal } from 'd3';

export default () => {
  const persons = ['pedestrian', 'cyclist', 'motorist'];
  const harms = ['fatalities', 'injuries'];
  const colorScale = scaleOrdinal(['#FFDB65', '#FF972A', '#FE7B8C']).domain(persons);
  const radius = 5; // radius of circles
  const width = 500; // width of SVG
  const offset = 150; // width of each circle label

  function renderLegendRow(personType, harmType) {
    return personType.map((person, i) => (
      <g transform={`translate(${i * offset}, 0)`}>
        <circle
          cx={0}
          cy={0}
          r={radius}
          fill={harmType === harms[0] ? colorScale(person) : 'none'}
          stroke={harmType === harms[1] ? colorScale(person) : 'none'}
        />
        <text x={10} y={5}>{`${person} ${harmType}`}</text>
      </g>
    ));
  }

  return (
    <div className="CompareLegend">
      <div className="compare-legend-row">
        <svg className="compare-legend-circles" width={width} height="15">
          <g transform="translate(7,7)">{renderLegendRow(persons, harms[0])}</g>
        </svg>
      </div>
      <div className="compare-legend-row">
        <svg className="compare-legend-circles" width={width} height="15">
          <g transform="translate(7,7)">{renderLegendRow(persons, harms[1])}</g>
        </svg>
      </div>
    </div>
  );
};
