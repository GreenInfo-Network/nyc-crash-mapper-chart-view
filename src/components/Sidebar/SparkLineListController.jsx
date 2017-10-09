import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineList from '../../containers/SparkLineList';
import LoadingMsg from '../LoadingMsg';

/** Class that houses the SparkLineList and provides a UI & Controller for filtering & sorting it
*/
class SparkLineContainer extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    isFetchingRanked: PropTypes.bool.isRequired,
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
    const { entityType, sparkLineListHeight, isFetchingRanked } = this.props;
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
          <button onClick={this.handleBtnSortNameClick}>Sort Name</button>
          <button onClick={this.handleBtnSortRankClick}>Sort Rank</button>
        </div>
        {!isFetchingRanked ? (
          <SparkLineList
            filterTerm={inputValue}
            {...{ sortName, sortRank, sortAsc, sparkLineListHeight }}
          />
        ) : (
          <LoadingMsg />
        )}
      </div>
    );
  }
}

export default SparkLineContainer;
