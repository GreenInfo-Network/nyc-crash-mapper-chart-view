import React from 'react';

import styleVars from '../../common/styleVars';

const w = 100;
const h = 10;
const {
  'sparkline-color-1': color1,
  'sparkline-color-2': color2,
  'sparkline-color-3': color3,
} = styleVars;

// TO DO: extract gradient values in styleVars.js and use both here and RankCard
export default () => (
  <div className="RankLegend">
    <p>Less</p>
    <svg width={w} height={h}>
      <linearGradient id="legend-gradient" x1="1" y1="0" x2="0" y2="0">
        <stop offset="0%" stopColor={color1} />
        <stop offset="50%" stopColor={color2} />
        <stop offset="100%" stopColor={color3} />
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
