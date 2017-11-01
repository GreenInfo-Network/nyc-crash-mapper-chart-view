import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

import * as pt from '../../common/reactPropTypeDefs';

// Markup representing a "Card" that contains a rank, entity name, and sparkline
const RankCard = props => {
  const {
    entity,
    entityTypeDisplay,
    rankTotal,
    width,
    height,
    lineGenerator,
    primaryKey,
    secondaryKey,
  } = props;
  const { key, values, rank } = entity;
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
      data-rank-sort={rank}
      data-name-sort={key}
      data-search={`city council ${label}`}
    >
      <h6
        style={{ padding: 0 }}
      >{`${entityTypeDisplay} ${label} – Rank: ${rank} / ${rankTotal}`}</h6>
      <svg width={width} height={height}>
        <defs>
          <linearGradient id={`gradient-${key}`} x1="0%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#f03b20" />
            <stop offset="50%" stopColor="#feb24c" />
            <stop offset="100%" stopColor="#ffeda0" />
          </linearGradient>
          <mask id={`mask-${key}`} x="0" y="0" width={width} height={height}>
            <path
              fill="transparent"
              strokeWidth="2"
              stroke="#ffeda0"
              className="line spark"
              d={lineGenerator(values)}
            />
          </mask>
        </defs>
        <g transform="translate(0, 2.0)">
          <rect
            x="0"
            y="-2"
            width={width}
            height={height}
            style={{ stroke: 'none', fill: `url(#gradient-${key})`, mask: `url(#mask-${key})` }}
          />
        </g>
      </svg>
    </div>
  );
};

RankCard.propTypes = {
  entity: pt.entity,
  entityTypeDisplay: PropTypes.string,
  rankTotal: PropTypes.number,
  lineGenerator: PropTypes.func.isRequired,
  width: PropTypes.number,
  height: PropTypes.number,
  primaryKey: pt.key,
  secondaryKey: pt.key,
};

RankCard.defaultProps = {
  entity: {},
  entityTypeDisplay: '',
  rankTotal: null,
  width: null,
  height: null,
  primaryKey: null,
  secondaryKey: null,
};

export default RankCard;
