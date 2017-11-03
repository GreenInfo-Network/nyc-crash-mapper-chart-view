import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EntitySelector from './EntitySelector';
import * as pt from '../../common/reactPropTypeDefs';
import styleVars from '../../common/styleVars';

/**
 * Class that houses the Entity Selector components
 * connected to the Redux store via react-redux
 */
class EntitySelections extends Component {
  static propTypes = {
    chartView: PropTypes.string.isRequired,
    entityType: pt.key,
    primary: pt.entity,
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
      deselectPrimaryEntity,
      deselectSecondaryEntity,
    } = this.props;

    return (
      <div className="EntitySelections">
        {chartView !== 'rank' && (
          <EntitySelector
            color={styleVars['reference-color']}
            entityType={'City Wide'}
            entity={' '}
          />
        )}
        <EntitySelector
          color={primary.color}
          entityType={entityType}
          entity={primary.key}
          deselectEntity={deselectPrimaryEntity}
        />
        <EntitySelector
          color={secondary.color}
          entityType={entityType}
          entity={secondary.key}
          deselectEntity={deselectSecondaryEntity}
        />
      </div>
    );
  }
}

export default EntitySelections;
