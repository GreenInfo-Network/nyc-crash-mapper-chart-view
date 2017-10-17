// NOTE: this component gets connected to the Redux Store in ../../containers/Legend.jsx
import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import EntitySelections from './EntitySelections';
import Toggle from '../../containers/Toggle';

const Legend = props => {
  const { entities, deselectPrimaryEntity, deselectSecondaryEntity } = props;

  return (
    <div className="Legend">
      <EntitySelections
        {...entities}
        deselectPrimaryEntity={deselectPrimaryEntity}
        deselectSecondaryEntity={deselectSecondaryEntity}
      />
      <Toggle />
    </div>
  );
};

Legend.propTypes = {
  entities: pt.entities.isRequired,
  filterType: pt.filterType.isRequired,
  trendCompare: pt.trendCompare.isRequired,
  deselectPrimaryEntity: PropTypes.func.isRequired,
  deselectSecondaryEntity: PropTypes.func.isRequired,
};

export default Legend;
