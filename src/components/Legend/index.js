// NOTE: this component gets connected to the Redux Store in ../../containers/Legend.jsx
import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import EntitySelections from './EntitySelections';
import CompareLegend from './CompareLegend';

const Legend = props => {
  const { entities, deselectPrimaryEntity, deselectSecondaryEntity, chartView } = props;

  return (
    <div className="Legend">
      {chartView === 'compare' ? (
        <CompareLegend />
      ) : (
        <EntitySelections
          {...entities}
          {...{ chartView }}
          deselectPrimaryEntity={deselectPrimaryEntity}
          deselectSecondaryEntity={deselectSecondaryEntity}
        />
      )}
    </div>
  );
};

Legend.propTypes = {
  entities: pt.entities.isRequired,
  filterType: pt.filterType.isRequired,
  chartView: pt.chartView.isRequired,
  deselectPrimaryEntity: PropTypes.func.isRequired,
  deselectSecondaryEntity: PropTypes.func.isRequired,
};

export default Legend;
