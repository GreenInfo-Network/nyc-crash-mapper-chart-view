import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import classNames from 'classnames';

import { width, height, xScale, yScale, area, line } from '../common/d3Utils';

// this is the start of an abstracted Array.prototype.sort function, might be more trouble than it's
// worth though...
function sort(arr, prop, asc) {
  const sortVal = asc ? -1 : 1;
  const sortVal2 = asc ? 1 : -1;

  arr.sort((a, b) => {
    if (a[prop] > b[prop]) return sortVal;
    if (a[prop] < b[prop]) return sortVal2;
    return 0;
  });
}

/** Class that renders a list of SVG sparkLines
*/
class SparkLineList extends Component {
  static propTypes = {
    primary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    secondary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    nested: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
    sortName: PropTypes.bool.isRequired,
    sortRank: PropTypes.bool.isRequired,
    sortAsc: PropTypes.bool.isRequired,
    selectPrimaryEntity: PropTypes.func.isRequired,
    deselectPrimaryEntity: PropTypes.func.isRequired,
    selectSecondaryEntity: PropTypes.func.isRequired,
    deselectSecondaryEntity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    nested: [],
    filterTerm: '',
  };

  constructor() {
    super();
    this.renderSparkLines = this.renderSparkLines.bind(this);
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

  handleSparkLineClick(key, values) {
    const { secondary, primary, selectPrimaryEntity, selectSecondaryEntity } = this.props;

    if (!primary.key && key !== primary.key) {
      selectPrimaryEntity(key, values);
      return;
    }

    if (primary.key && !secondary.key && key !== secondary.key) {
      selectSecondaryEntity(key, values);
    }
  }

  renderSparkLines() {
    const { primary, secondary } = this.props;
    const { entitiesSorted } = this.state;

    if (!entitiesSorted.length) return null;

    return entitiesSorted.map(entity => {
      const { key, values, rank } = entity;
      const label = +key < 10 ? `0${key}` : key;

      // class names for list items
      const listItemClass = classNames({
        'sparkline-list-item': true,
        'primary-active': key === primary.key,
        'secondary-active': key === secondary.key,
      });

      // store some data- properties so we can filter on them later
      return (
        // eslint-disable-next-line
        <li
          key={key}
          data-rank-sort={rank}
          data-name-sort={+key}
          data-search={`city council ${label}`}
          className={listItemClass}
          onClick={() => this.handleSparkLineClick(key, values)}
        >
          <h6 style={{ padding: 0 }}>{`City Council ${label} – Rank: ${rank + 1}`}</h6>
          <svg width={width} height={height} style={{ border: '1px solid #999' }}>
            <path fill="#e7e7e7" className="area spark" d={area(values)} />
            <path
              fill="none"
              strokeWidth="1.5px"
              stroke="#666"
              className="line spark"
              d={line(values)}
            />
          </svg>
        </li>
      );
    });
  }

  render() {
    let listItems = this.renderSparkLines();
    listItems = this.filterListItems(listItems);
    this.sortListItems(listItems);

    return <ul className="SparkLineList scroll">{listItems}</ul>;
  }
}

export default SparkLineList;
