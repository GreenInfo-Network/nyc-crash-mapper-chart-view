import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EntitySelector from './EntitySelector';
import * as pt from '../../common/reactPropTypeDefs';
import styleVars from '../../common/styleVars';
import entityTypeDisplay, { entityIdDisplay } from '../../common/labelFormatters';

/**
 * Class that houses the Entity Selector components
 * connected to the Redux store via react-redux
 */
class EntitySelections extends Component {
  static propTypes = {
    chartView: PropTypes.string.isRequired,
    entityType: pt.key,
    primary: pt.entity,
    reference: PropTypes.string.isRequired,
    secondary: pt.entity,
    deselectPrimaryEntity: PropTypes.func.isRequired,
    deselectSecondaryEntity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    primary: null,
    secondary: null,
  };

  render() {
    const {
      chartView,
      entityType,
      primary,
      secondary,
      reference,
      deselectPrimaryEntity,
      deselectSecondaryEntity,
    } = this.props;

    const style = {
      width:
        chartView === 'rank' ? `calc(100% - ${styleVars['rank-legend-width']}px - 20px)` : '100%',
    };

    return (
      <div className="EntitySelections" style={style}>
        {chartView !== 'rank' && (
          <EntitySelector
            chartView={chartView}
            color={styleVars['reference-color']}
            entityType={reference}
            entity={' '}
          />
        )}
        <EntitySelector
          chartView={chartView}
          color={primary.color}
          entityType={entityTypeDisplay(entityType)}
          entity={entityIdDisplay(entityType, primary.key)}
          deselectEntity={deselectPrimaryEntity}
        />
        <EntitySelector
          chartView={chartView}
          color={secondary.color}
          entityType={entityTypeDisplay(entityType)}
          entity={entityIdDisplay(entityType, secondary.key)}
          deselectEntity={deselectSecondaryEntity}
        />
      </div>
    );
  }
}

export default EntitySelections;
