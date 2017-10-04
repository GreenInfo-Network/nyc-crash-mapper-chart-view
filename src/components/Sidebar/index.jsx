import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineListController from './SparkLineListController';
import OptionsContainer from './OptionsContainer';
import FilterByType from '../../containers/FilterByType';

class Sidebar extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
    entityType: PropTypes.string,
  };

  static defaultProps = {
    entityType: '',
  };

  render() {
    const { entities, entityType } = this.props;
    return (
      <div className="Sidebar">
        <OptionsContainer title={'Filter By Type'}>
          <FilterByType />
        </OptionsContainer>
        <OptionsContainer title={'Filter By Boundary'} collapsable={false}>
          <SparkLineListController {...{ entities, entityType }} />
        </OptionsContainer>
      </div>
    );
  }
}

export default Sidebar;
