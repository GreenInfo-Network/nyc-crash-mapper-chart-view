import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineList from '../../containers/SparkLineList';

/** Class that houses the SparkLineList and provides a UI & Controller for filtering it
*/
class SparkLineContainer extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterTerm: PropTypes.string,
    sparkLineListHeight: PropTypes.number,
    filterEntitiesByName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    filterTerm: '',
    sparkLineListHeight: null,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.filterEntitiesByName(event.target.value);
  }

  render() {
    const { entityType, filterTerm, sparkLineListHeight } = this.props;

    return (
      <div className="SparkLineListController">
        <div className="sparkline-controls">
          <input
            placeholder={`Search a ${entityType.replace(/_/, ' ')}`}
            value={filterTerm}
            onChange={this.handleChange}
            type="text"
          />
        </div>
        <SparkLineList {...{ sparkLineListHeight }} />
      </div>
    );
  }
}

export default SparkLineContainer;
