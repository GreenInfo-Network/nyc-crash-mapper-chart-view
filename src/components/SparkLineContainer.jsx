import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineListConnected from '../containers/SparkLineListConnected';

/** Class that houses the SparkLineList and provides a UI & Controller for filtering & sorting it
*/
class SparkLineContainer extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
    entityType: PropTypes.string,
  };

  static defaultProps = {
    entityType: '',
  };

  constructor() {
    super();
    this.state = {
      inputValue: '',
      sortName: false,
      sortRank: true,
      sortAsc: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleBtnSortNameClick = this.handleBtnSortNameClick.bind(this);
    this.handleBtnSortRankClick = this.handleBtnSortRankClick.bind(this);
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  handleBtnSortNameClick() {
    this.setState({
      sortName: true,
      sortAsc: !this.state.sortAsc,
      sortRank: false,
    });
  }

  handleBtnSortRankClick() {
    this.setState({
      sortRank: true,
      sortAsc: !this.state.sortAsc,
      sortName: false,
    });
  }

  render() {
    const { entities, entityType } = this.props;
    const { inputValue, sortName, sortRank, sortAsc } = this.state;

    return (
      <div className="SparkLineContainer">
        <div className="sparkline-controls">
          <input
            placeholder={`Search a ${entityType}`}
            value={inputValue}
            onChange={this.handleChange}
            type="text"
          />
          <button onClick={this.handleBtnSortNameClick}>Sort Name</button>
          <button onClick={this.handleBtnSortRankClick}>Sort Rank</button>
        </div>
        <SparkLineListConnected
          filterTerm={inputValue}
          {...{ entities, sortName, sortRank, sortAsc }}
        />
      </div>
    );
  }
}

export default SparkLineContainer;
