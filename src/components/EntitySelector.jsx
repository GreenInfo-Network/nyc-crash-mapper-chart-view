import React from 'react';
import PropTypes from 'prop-types';

const EntitySelector = props => {
  const { color, entityType, entity, deselectEntity } = props;
  const colorKeyStyle = {
    backgroundColor: entity ? color : null,
  };

  return (
    <div className="EntitySelector">
      <div className="flex-wrapper">
        <span className="color-key" style={colorKeyStyle} />
        <h6>{entity ? `${entityType} ${entity}` : '(none selected)'}</h6>
        <button className="deselect" onClick={() => deselectEntity()}>
          {'×'}
        </button>
      </div>
    </div>
  );
};

EntitySelector.propTypes = {
  color: PropTypes.string.isRequired,
  entityType: PropTypes.string,
  entity: PropTypes.string,
  deselectEntity: PropTypes.func.isRequired,
};

EntitySelector.defaultProps = {
  entityType: '',
  entity: '',
};

export default EntitySelector;
