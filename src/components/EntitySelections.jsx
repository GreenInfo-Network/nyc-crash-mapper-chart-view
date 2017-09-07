import React, { Component } from 'react';
import PropTypes from 'prop-types';

import EntitySelector from './EntitySelector';

class EntitySelections extends Component {
  static propTypes = {
    primary: PropTypes.shape({}),
    secondary: PropTypes.shape({}),
    deselectPrimaryEntity: PropTypes.func.isRequired,
    deselectSecondaryEntity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    primary: null,
    secondary: null,
  };

  render() {
    const { primary, secondary, deselectPrimaryEntity, deselectSecondaryEntity } = this.props;
    return (
      <div className="EntitySelections">
        <EntitySelector entity={primary.key} deselectEntity={deselectPrimaryEntity} />
        <p>Compared to</p>
        <EntitySelector entity={secondary.key} deselectEntity={deselectSecondaryEntity} />
      </div>
    );
  }
}

export default EntitySelections;
