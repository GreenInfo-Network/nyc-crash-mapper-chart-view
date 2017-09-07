import React from 'react';
import PropTypes from 'prop-types';

const EntitySelector = props => {
  const { entity, deselectEntity } = props;

  return (
    <div className="EntitySelector">
      <div className="flex-wrapper">
        <span className="color-key" />
        <h6>{entity || '(none selected)'}</h6>
        <button className="deselect" onClick={() => deselectEntity()}>
          {'×'}
        </button>
      </div>
    </div>
  );
};

EntitySelector.propTypes = {
  entity: PropTypes.string,
  deselectEntity: PropTypes.func.isRequired,
};

EntitySelector.defaultProps = {
  entity: '',
};

export default EntitySelector;
