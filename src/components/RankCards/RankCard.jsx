import React, { Component } from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as pt from '../../common/reactPropTypeDefs';

// Class a "Card" that contains a rank, entity name, and sparkline
class RankCard extends Component {
  constructor() {
    super();
    this.container = null; // ref to outter most div
  }

  renderSVG() {
    const { entity, svgWidth, svgHeight, strokeWidth, path } = this.props;
    const { key } = entity;

    return (
      <svg width={svgWidth} height={svgHeight}>
        <defs>
          <linearGradient id={`gradient-${key}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor="#f03b20" />
            <stop offset="50%" stopColor="#feb24c" />
            <stop offset="100%" stopColor="#ffeda0" />
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
    const { entity, entityTypeDisplay, rankTotal, primaryKey, secondaryKey } = this.props;
    const { key, rank, totalInjured, totalKilled } = entity;
    let label;

    if (typeof +key === 'number') {
      label = +key < 10 ? `0${key}` : key;
    } else {
      label = key;
    }

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
      >
        <h6>
          <span className="rank-pos">{rank}</span> / {rankTotal}
        </h6>
        <h6 className="rank-entity-type">{`${entityTypeDisplay} ${label}`}</h6>
        <p>{`${totalInjured} injuries, ${totalKilled} fatalities`}</p>
        {this.renderSVG()}
      </div>
    );
  }
}

RankCard.propTypes = {
  entity: pt.entity,
  entityTypeDisplay: PropTypes.string,
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
  entityTypeDisplay: '',
  rankTotal: null,
  svgWidth: null,
  svgHeight: null,
  chartHeight: null,
  primaryKey: null,
  secondaryKey: null,
  path: '',
};

export default RankCard;
