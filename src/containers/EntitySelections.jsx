import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';

import { deselectPrimaryEntity, deselectSecondaryEntity } from '../actions';
import EntitySelector from '../components/EntitySelector';
import * as pt from '../common/reactPropTypeDefs';

// maps part of redux store to component props
const mapStateToProps = ({ entities }) => {
  const { primary, secondary, entityType } = entities;
  return {
    entityType,
    primary,
    secondary,
  };
};

/**
 * Class that houses the Entity Selector components
 * connected to the Redux store via react-redux
 */
class EntitySelections extends Component {
  static propTypes = {
    entityType: pt.key,
    primary: pt.entity,
    secondary: pt.entity,
    dispatch: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    primary: null,
    secondary: null,
  };

  render() {
    const { entityType, primary, secondary, dispatch } = this.props;
    const boundActionCreators = bindActionCreators(
      { deselectPrimaryEntity, deselectSecondaryEntity },
      dispatch
    );
    return (
      <div className="EntitySelections">
        <EntitySelector color={'#999'} entityType={'City Wide'} entity={' '} />
        <EntitySelector
          color={primary.color}
          entityType={entityType}
          entity={primary.key}
          deselectEntity={boundActionCreators.deselectPrimaryEntity}
        />
        <EntitySelector
          color={secondary.color}
          entityType={entityType}
          entity={secondary.key}
          deselectEntity={boundActionCreators.deselectSecondaryEntity}
        />
      </div>
    );
  }
}

export default connect(mapStateToProps)(EntitySelections);
