import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import { entityDataSelector } from '../common/reduxSelectors';
import rankedListSelector from '../common/reduxSelectorsRankedList';
import * as pt from '../common/reactPropTypeDefs';
import styleVars from '../common/styleVars';

import RankCard from '../components/RankCards/RankCard';

const mapStateToProps = state => {
  const { browser, entities, filterType } = state;
  const { width } = browser;
  const { entityType } = entities;
  const { response } = entityDataSelector(state);
  const ranked = response && response.length ? rankedListSelector(state) : null;

  return {
    appWidth: width,
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
    appWidth: PropTypes.number.isRequired,
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
    this.renderRankCards = this.renderRankCards.bind(this);
    this.container = null;
  }

  getContainerSize() {
    // set the width and height of the svg from the parent div's width height, which is set via CSS
    const bcr = this.container ? this.container.getBoundingClientRect() : null;
    const cWidth = bcr ? Math.floor(bcr.width) - 20 : 0;
    const cHeight = bcr ? Math.floor(bcr.height) - 40 : 0;

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  filterListItems(listItems) {
    // return a new array of filtered list items
    const { filterTerm } = this.props;

    // if there's a filter term, filter out those that do not match it
    if (listItems && filterTerm !== '') {
      listItems = listItems.filter(li => {
        const { props } = li;
        const { entity, entityTypeDisplay } = props;
        const searchTerm = `${entityTypeDisplay} ${entity.key}`;
        return searchTerm.toLowerCase().indexOf(filterTerm.toLowerCase()) !== -1;
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
        if (a.props.entity.rank > b.props.entity.rank) return 1;
        if (a.props.entity.rank < b.props.entity.rank) return -1;
        return 0;
      });
    }

    // if sorting by rank and sort ascending
    if (sortRank && sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props.entity.rank > b.props.entity.rank) return -1;
        if (a.props.entity.rank < b.props.entity.rank) return 1;
        return 0;
      });
    }

    // if sorting by name and sort descending
    if (sortName && !sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props.entity.key > b.props.entity.key) return 1;
        if (a.props.entity.key < b.props.entity.key) return -1;
        return 0;
      });
    }

    // if sorting by name and sort ascending
    if (sortName && sortAsc && listItems) {
      listItems.sort((a, b) => {
        if (a.props.entity.key > b.props.entity.key) return -1;
        if (a.props.entity.key < b.props.entity.key) return 1;
        return 0;
      });
    }
  }

  renderRankCards() {
    const { appWidth, entityType, primary, secondary, ranked } = this.props;
    const entityTypeDisplay = entityType.replace(/_/g, ' ');
    // we have to pass a width down to the cards because SVG features require dimensions in pixels, not percentages
    // and the first render of the RankCard will not be able to compute it's own height
    // account for padding-left, padding-right & scrollbar width
    const cardWidth = (appWidth - styleVars['app-column-right'] - 40 - 10) / 4;
    // account for card margins & padding & border
    const svgWidth = Math.floor(cardWidth - 10 - 20 - 2);
    const svgHeight = 50;
    const strokeWidth = 2;
    const chartHeight = svgHeight - strokeWidth * 2;

    if (!ranked.length) return null;

    const total = ranked.length;

    // set x-scale domain & range, assumes values are sorted by date
    const xScale = d3
      .scaleTime()
      .range([0, svgWidth])
      .domain([
        d3.min(ranked, d => d.values[0].year_month),
        d3.max(ranked, d => d.values[d.values.length - 1].year_month),
      ]);

    // set y-scale domain & range
    const yScale = d3
      .scaleLinear()
      .range([chartHeight, 0])
      .domain([0, d3.max(ranked, d => d.maxTotal)]);

    const linePathGenerator = d3
      .line()
      .x(d => xScale(d.year_month))
      .y(d => yScale(d.total))
      .curve(d3.curveMonotoneX);

    return ranked.map(entity => {
      const path = linePathGenerator(entity.values);
      return (
        <RankCard
          key={entity.key}
          entity={entity}
          entityTypeDisplay={entityTypeDisplay}
          rankTotal={total}
          svgWidth={svgWidth}
          svgHeight={svgHeight}
          chartHeight={chartHeight}
          strokeWidth={strokeWidth}
          primaryKey={primary.key}
          secondaryKey={secondary.key}
          path={path}
        />
      );
    });
  }

  render() {
    let listItems = this.renderRankCards();
    listItems = this.filterListItems(listItems);
    this.sortListItems(listItems);

    return (
      <div
        className="RankCardsList scroll"
        ref={_ => {
          this.container = _;
        }}
      >
        {listItems}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(RankCardsList);
