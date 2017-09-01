import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

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
    entities: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
    sortName: PropTypes.bool.isRequired,
    sortRank: PropTypes.bool.isRequired,
    sortAsc: PropTypes.bool.isRequired,
  };

  static defaultProps = {
    entities: [],
    filterTerm: '',
  };

  constructor() {
    super();
    this.renderSparkLines = this.renderSparkLines.bind(this);
    // to store a sorted copy of the data (rather than mutating the original data)
    this.state = {
      entitiesSorted: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    if (nextProps.entities.length !== this.props.entities.length) {
      // if the entities array updated, compute max & sum, reset the scales
      this.setScales(nextProps.entities);
    }
  }

  setScales(entities) {
    // compute max number of category, necessary for yScale.domain()
    // compute sum of category, so that councils may be sorted from max to min
    // category currently hardcoded to pedestrian_injured, this should be variable
    const newEntities = entities.map(entity => {
      const x = { ...entity };
      x.maxPedInj = d3.max(x.values, d => d.pedestrian_injured);
      x.totalPedInj = d3.sum(x.values, d => d.pedestrian_injured);
      return x;
    });

    // sort descending by total ped injuries (rank)
    sort(newEntities, 'totalPedInj', true);

    // store the ranking as a data value
    newEntities.forEach((d, i) => {
      d.rank = i;
    });

    // compute min and max date across councils, assumes data is sorted by date
    xScale.domain([
      d3.min(newEntities, c => c.values[0].year_month),
      d3.max(newEntities, c => c.values[c.values.length - 1].year_month),
    ]);

    // use same yScale domain
    yScale.domain([0, d3.max(newEntities, d => d.maxPedInj)]);

    // store the sorted data in state, which will cause a re-render
    this.setState({
      entitiesSorted: newEntities,
    });
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

  renderSparkLines() {
    const { entitiesSorted } = this.state;

    if (!entitiesSorted.length) return null;

    return entitiesSorted.map(entity => {
      const { key, values, rank } = entity;
      const label = +key < 10 ? `0${key}` : key;

      // store some data- properties so we can filter on them later
      return (
        <li
          key={key}
          data-rank-sort={rank}
          data-name-sort={+key}
          data-search={`city council ${label}`}
          className="sparkline-list-item"
          style={{
            display: 'inline-block',
            margin: '5px',
          }}
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

    return (
      <ul
        style={{
          width: width + 30,
          height: '100%',
          maxHeight: '600px',
        }}
        className="SparkLineList scroll"
      >
        {listItems}
      </ul>
    );
  }
}

export default SparkLineList;
