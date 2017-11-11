import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as pt from '../../common/reactPropTypeDefs';
import styleVars from '../../common/styleVars';
import { formatNumber } from '../../common/d3Utils';

// Class a "Card" that contains a rank, entity name, and sparkline
class RankCard extends Component {
  constructor() {
    super();
    this.container = null; // ref to outter most div
  }

  renderSVG() {
    const { entity, svgWidth, svgHeight, strokeWidth, path } = this.props;
    const { key } = entity;
    const {
      'sparkline-color-1': color1,
      'sparkline-color-2': color2,
      'sparkline-color-3': color3,
    } = styleVars;

    return (
      <svg width={svgWidth} height={svgHeight}>
        <defs>
          <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color1} />
            <stop offset="50%" stopColor={color2} />
            <stop offset="100%" stopColor={color3} />
          </linearGradient>
          <mask
            id={`mask-${key}`}
            x="0"
            y="0"
            width={Math.floor(svgWidth + strokeWidth * 2)}
            height={svgHeight + strokeWidth * 2}
          >
            <path fill="none" strokeWidth={strokeWidth} stroke="#ffeda0" d={path} />
          </mask>
        </defs>
        <g transform={`translate(0, ${strokeWidth})`}>
          <rect
            x="0"
            y={-strokeWidth}
            width={svgWidth}
            height={svgHeight}
            style={{ stroke: 'none', fill: `url("#gradient-${key}")`, mask: `url("#mask-${key}")` }}
          />
        </g>
      </svg>
    );
  }

  render() {
    const {
      entity,
      entityLabel,
      idLabel,
      rankTotal,
      primaryKey,
      secondaryKey,
      handleClick,
    } = this.props;
    const { key, rank, totalInjured, totalKilled } = entity;

    // class names for list items
    const rankCardClassNames = classNames({
      RankCard: true,
      'primary-active': key === primaryKey,
      'secondary-active': key === secondaryKey,
    });

    return (
      <div
        className={rankCardClassNames}
        ref={_ => {
          this.container = _;
        }}
        onClick={() => handleClick(key)}
      >
        <h6>
          <span className="rank-pos">{rank}</span> / {rankTotal}
        </h6>
        <h6 className="rank-entity-type">{`${entityLabel} ${idLabel}`}</h6>
        <p>{`${formatNumber(totalInjured)} injuries, ${formatNumber(totalKilled)} fatalities`}</p>
        {this.renderSVG()}
      </div>
    );
  }
}

RankCard.propTypes = {
  entity: pt.entity,
  entityLabel: PropTypes.string,
  idLabel: PropTypes.string,
  handleClick: PropTypes.func.isRequired,
  rankTotal: PropTypes.number,
  strokeWidth: PropTypes.number.isRequired,
  svgWidth: PropTypes.number,
  svgHeight: PropTypes.number,
  chartHeight: PropTypes.number,
  primaryKey: pt.key,
  secondaryKey: pt.key,
  path: PropTypes.string,
};

RankCard.defaultProps = {
  entity: {},
  entityLabel: '',
  idLabel: '',
  rankTotal: null,
  svgWidth: null,
  svgHeight: null,
  chartHeight: null,
  primaryKey: null,
  secondaryKey: null,
  path: '',
};

export default RankCard;
