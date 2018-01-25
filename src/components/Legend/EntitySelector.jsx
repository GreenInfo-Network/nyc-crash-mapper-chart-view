import React from 'react';
import PropTypes from 'prop-types';
import classNames from 'classnames';

const EntitySelector = props => {
  const { chartView, color, entityId, entityLabel, deselectEntity } = props;
  const colorKeyStyle = {
    backgroundColor: entityId ? color : null,
  };
  const colorKeyClassNames = classNames({
    'color-key': true,
    line: chartView === 'trend',
    square: chartView === 'rank',
  });

  if (!entityId) {
    return null;
  }

  return (
    <div className="EntitySelector">
      <div className="flex-wrapper">
        <span className={colorKeyClassNames} style={colorKeyStyle} />
        <h6>{entityLabel}</h6>
        {deselectEntity && (
          <button className="deselect" onClick={() => deselectEntity()}>
            {'×'}
          </button>
        )}
      </div>
    </div>
  );
};

EntitySelector.propTypes = {
  chartView: PropTypes.string.isRequired,
  color: PropTypes.string.isRequired,
  entityId: PropTypes.string,
  entityLabel: PropTypes.string,
  deselectEntity: PropTypes.func,
};

EntitySelector.defaultProps = {
  entityId: null,
  entityLabel: null,
  deselectEntity: null,
};

export default EntitySelector;
