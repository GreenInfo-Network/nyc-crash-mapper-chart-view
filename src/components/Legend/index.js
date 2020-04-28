// NOTE: this component gets connected to the Redux Store in ../../containers/Legend.jsx
import React from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import EntitySelections from './EntitySelections';
import CompareLegend from './CompareLegend';
import Logos from './Logos';
import VehicleLegend from './VehicleLegend';

const Legend = props => {
  const { entities, deselectPrimaryEntity, deselectSecondaryEntity, chartView } = props;
  const className = chartView === 'about' ? 'Legend view-about' : 'Legend';

  function renderLegend() {
    switch (chartView) {
      case 'compare':
        return <CompareLegend />;

      case 'trend':
        return (
          <EntitySelections
            {...entities}
            {...{ chartView }}
            deselectPrimaryEntity={deselectPrimaryEntity}
            deselectSecondaryEntity={deselectSecondaryEntity}
          />
        );

      case 'vehicle':
        return <VehicleLegend />;

      case 'rank':
        return (
          <EntitySelections
            key="b"
            {...entities}
            {...{ chartView }}
            deselectPrimaryEntity={deselectPrimaryEntity}
            deselectSecondaryEntity={deselectSecondaryEntity}
          />
        );

      default:
        return null;
    }
  }

  return (
    <div className={className}>
      {renderLegend()}
      <Logos />
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
