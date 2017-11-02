import React, { Component } from 'react';
import PropTypes from 'prop-types';

import RankCardsList from '../../containers/RankCardsList';

/**
  * Class that houses the rank list view
  * Contains logic for sorting the ranked cards by rank or name
*/
class RankCardsContainer extends Component {
  static propTypes = {
    entityType: PropTypes.string,
  };

  static defaultProps = {
    entityType: '',
  };

  constructor(props) {
    super(props);
    this.state = {
      sortName: false,
      sortRank: true,
      sortAsc: false,
    };
    this.handleBtnSortNameClick = this.handleBtnSortNameClick.bind(this);
    this.handleBtnSortRankClick = this.handleBtnSortRankClick.bind(this);
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
    const { inputValue, sortName, sortRank, sortAsc } = this.state;

    return (
      <div className="RankCardsContainer">
        <div className="rankcards-controls">
          <button onClick={this.handleBtnSortNameClick}>Sort Name</button>
          <button onClick={this.handleBtnSortRankClick}>Sort Rank</button>
        </div>
        <RankCardsList filterTerm={inputValue} {...{ sortName, sortRank, sortAsc }} />
      </div>
    );
  }
}

export default RankCardsContainer;
