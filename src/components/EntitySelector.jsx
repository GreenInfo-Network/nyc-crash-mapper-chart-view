import React from 'react';
import PropTypes from 'prop-types';
import * as pt from '../common/reactPropTypeDefs';

const EntitySelector = props => {
  const { color, entityType, entity, deselectEntity } = props;
  const colorKeyStyle = {
    backgroundColor: entity ? color : null,
  };

  if (!entity) {
    return null;
  }

  return (
    <div className="EntitySelector">
      <div className="flex-wrapper">
        <span className="color-key" style={colorKeyStyle} />
        <h6>{entity ? `${entityType.replace(/_/g, ' ')} ${entity}` : '(none selected)'}</h6>
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
  color: PropTypes.string.isRequired,
  entityType: PropTypes.string,
  entity: pt.key,
  deselectEntity: PropTypes.func,
};

EntitySelector.defaultProps = {
  entityType: '',
  entity: null,
  deselectEntity: null,
};

export default EntitySelector;
