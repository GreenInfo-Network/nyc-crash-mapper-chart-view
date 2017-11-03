import React from 'react';

const w = 100;
const h = 10;

// TO DO: extract gradient values in styleVars.js and use both here and RankCard
export default () => (
  <div className="RankLegend">
    <p>Less</p>
    <svg width={w} height={h}>
      <linearGradient id="legend-gradient" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor="#f03b20" />
        <stop offset="50%" stopColor="#feb24c" />
        <stop offset="100%" stopColor="#ffeda0" />
      </linearGradient>
      <rect
        x="0"
        y="0"
        width={w}
        height={h}
        style={{ stroke: 'none', fill: 'url("#legend-gradient")' }}
      />
    </svg>
    <p>More</p>
  </div>
);
