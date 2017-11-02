import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineList from '../../containers/SparkLineList';

/** Class that houses the SparkLineList and provides a UI & Controller for filtering & sorting it
*/
class SparkLineContainer extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    sparkLineListHeight: PropTypes.number,
  };

  static defaultProps = {
    entityType: '',
    sparkLineListHeight: null,
  };

  constructor() {
    super();
    this.state = {
      inputValue: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  render() {
    const { entityType, sparkLineListHeight } = this.props;
    const { inputValue, sortName, sortRank, sortAsc } = this.state;

    return (
      <div className="SparkLineListController">
        <div className="sparkline-controls">
          <input
            placeholder={`Search a ${entityType.replace(/_/, ' ')}`}
            value={inputValue}
            onChange={this.handleChange}
            type="text"
          />
        </div>
        <SparkLineList
          filterTerm={inputValue}
          {...{ sortName, sortRank, sortAsc, sparkLineListHeight }}
        />
      </div>
    );
  }
}

export default SparkLineContainer;
