import React from 'react';

const data = {
  fatalities: ['pedestrian', 'cyclist', 'motorist'],
};

export default () => (
  <div className="CompareLegend">
    <div className="compare-legend-row">
      <svg className="compare-legend-circles">
        <circle></circle>
        <circle></circle>
        <circle></circle>
      </svg>
    </div>
    <div className="compare-legend-row">
      <svg className="compare-legend-circles">
        <circle></circle>
        <circle></circle>
        <circle></circle>
      </svg>
    </div>
  </div>
)
