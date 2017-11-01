import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { entityDataSelector } from '../common/reduxSelectors';
import rankedListSelector from '../common/reduxSelectorsRankedList';
import * as pt from '../common/reactPropTypeDefs';

import RankCard from '../components/RankCards/RankCard';

const mapStateToProps = state => {
  const { entities, filterType } = state;
  const { entityType } = entities;
  const { response } = entityDataSelector(state);
  const ranked = response && response.length ? rankedListSelector(state) : null;

  return {
    entityType,
    filterType,
    response,
    ranked: ranked || [],
    primary: entities.primary,
    secondary: entities.secondary,
  };
};

class RankCardsList extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterType: pt.filterType.isRequired,
    primary: pt.entity.isRequired,
    secondary: pt.entity.isRequired,
    ranked: PropTypes.arrayOf(PropTypes.object).isRequired,
    response: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
    sortName: PropTypes.bool.isRequired,
    sortRank: PropTypes.bool.isRequired,
    sortAsc: PropTypes.bool.isRequired,
    sparkLineListHeight: PropTypes.number,
  };

  static defaultProps = {
    entityType: '',
    response: [],
    filterTerm: '',
    sparkLineListHeight: null,
  };

  constructor(props) {
    super(props);

    // tmp margins & dimensions, will depend on card size
    this.margin = { top: 8, right: 10, bottom: 2, left: 10 };
    this.width = 260 - this.margin.left - this.margin.right;
    this.height = 45 - this.margin.top - this.margin.bottom;

    // x and y scales for drawing spark line paths
    this.xScale = d3.scaleTime().range([0, this.width]);
    this.yScale = d3.scaleLinear().range([this.height, 0]);

    // svg path generator for drawing an area
    this.area = d3
      .area()
      .x(d => this.xScale(d.year_month))
      .y0(this.height)
      .y1(d => this.yScale(d.total))
      .curve(d3.curveMonotoneX);

    // svg path generator for drawing a line
    this.line = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale(d.total))
      .curve(d3.curveMonotoneX);

    this.renderRankCards = this.renderRankCards.bind(this);
  }

  filterListItems(listItems) {
    // return a new array of filtered list items
    const { filterTerm } = this.props;

    // if there's a filter term, filter out those that do not match it
    if (listItems && filterTerm !== '') {
      listItems = listItems.filter(li => {
        const { props } = li;
        return props['data-search'].toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1;
      });
    }

    return listItems;
  }

  sortListItems(listItems) {
    // Sort list items based on props relating to how things should be sorted
    const { sortAsc, sortRank, sortName } = this.props;

    // if sorting by rank and sort descending
    if (sortRank && !sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props['data-rank-sort'] > b.props['data-rank-sort']) return 1;
        if (a.props['data-rank-sort'] < b.props['data-rank-sort']) return -1;
        return 0;
      });
    }

    // if sorting by rank and sort ascending
    if (sortRank && sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props['data-rank-sort'] > b.props['data-rank-sort']) return -1;
        if (a.props['data-rank-sort'] < b.props['data-rank-sort']) return 1;
        return 0;
      });
    }

    // if sorting by name and sort descending
    if (sortName && !sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props['data-name-sort'] > b.props['data-name-sort']) return 1;
        if (a.props['data-name-sort'] < b.props['data-name-sort']) return -1;
        return 0;
      });
    }

    // if sorting by name and sort ascending
    if (sortName && sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props['data-name-sort'] > b.props['data-name-sort']) return -1;
        if (a.props['data-name-sort'] < b.props['data-name-sort']) return 1;
        return 0;
      });
    }
  }

  renderRankCards() {
    // eslint-disable-next-line
    const { entityType, primary, secondary, ranked, response } = this.props;
    const entityTypeDisplay = entityType.replace(/_/g, ' ');
    const width = this.width;
    const height = this.height;
    const line = this.line;

    if (!ranked.length) return null;

    // set x-scale domain, assumes data is sorted by date
    this.xScale.domain([
      d3.min(ranked, d => d.values[0].year_month),
      d3.max(ranked, d => d.values[d.values.length - 1].year_month),
    ]);

    // set y-scale domain
    this.yScale.domain([0, d3.max(ranked, d => d.maxTotal)]);

    return ranked.map(entity => (
      <RankCard
        key={entity.key}
        entity={entity}
        entityTypeDisplay={entityTypeDisplay}
        rankTotal={ranked.length}
        lineGenerator={line}
        width={width}
        height={height}
        primaryKey={primary.key}
        secondaryKey={secondary.key}
      />
    ));
  }

  render() {
    let listItems = this.renderRankCards();
    listItems = this.filterListItems(listItems);
    this.sortListItems(listItems);

    return <div className="RankCardsList scroll">{listItems}</div>;
  }
}

export default connect(mapStateToProps, null)(RankCardsList);
