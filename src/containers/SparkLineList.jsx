import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';
import classNames from 'classnames';

import {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
} from '../actions';

import { allEntityData } from '../reducers';
import mapFilterTypesToProps, { sort } from '../common/utils';

// TO DO: move these into the SparkLineList class?
const margin = { top: 8, right: 10, bottom: 2, left: 10 };
const width = 260 - margin.left - margin.right;
const height = 45 - margin.top - margin.bottom;

const mapStateToProps = state => {
  const { entities, filterType } = state;
  const { entityType } = entities;
  const { response } = allEntityData(state);
  let nested = [];
  let mapped = [];

  // TO DO: this pattern will likely be used elsewhere, should get moved to a higher order function
  if (response) {
    // compute sum of currently enabled crash type type filters
    mapped = mapFilterTypesToProps(filterType, response);
    // nest data by geo identifier
    nested = d3
      .nest()
      .key(d => d[entityType])
      .entries(mapped.filter(d => d[entityType] !== '')); // be sure to filter out blanks
    // compute the max sum of each nested geo
    nested.forEach(entity => {
      const max = d3.max(entity.values, k => k.count);
      entity.max = max;
    });
    // sort nested data by max
    sort(nested, 'max', true);
    // apply a rank value using sorted array index
    nested.forEach((d, i) => {
      d.rank = i;
    });
  }

  return {
    entityType,
    filterType,
    response: mapped,
    nested,
    primary: entities.primary,
    secondary: entities.secondary,
  };
};

/** Connected Component that renders a list of SVG sparkLines
*/
class SparkLineList extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterType: PropTypes.shape({
      fatality: PropTypes.shape({
        cyclist: PropTypes.bool.isRequired,
        motorist: PropTypes.bool.isRequired,
        pedestrian: PropTypes.bool.isRequired,
      }),
      injury: PropTypes.shape({
        cyclist: PropTypes.bool.isRequired,
        motorist: PropTypes.bool.isRequired,
        pedestrian: PropTypes.bool.isRequired,
      }),
      noInjuryFatality: PropTypes.bool.isRequired,
    }).isRequired,
    primary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    secondary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    nested: PropTypes.arrayOf(PropTypes.object),
    response: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
    sortName: PropTypes.bool.isRequired,
    sortRank: PropTypes.bool.isRequired,
    sortAsc: PropTypes.bool.isRequired,
    selectPrimaryEntity: PropTypes.func.isRequired,
    deselectPrimaryEntity: PropTypes.func.isRequired,
    selectSecondaryEntity: PropTypes.func.isRequired,
    deselectSecondaryEntity: PropTypes.func.isRequired,
    sparkLineListHeight: PropTypes.number,
  };

  static defaultProps = {
    entityType: '',
    nested: [],
    response: [],
    filterTerm: '',
    sparkLineListHeight: null,
  };

  constructor(props) {
    super(props);

    this.renderSparkLines = this.renderSparkLines.bind(this);

    // x and y scales for drawing spark line paths
    this.xScale = d3.scaleTime().range([0, width]);
    this.yScale = d3.scaleLinear().range([height, 0]);

    // svg path generator for drawing an area
    this.area = d3
      .area()
      .x(d => this.xScale(d.year_month))
      .y0(height)
      .y1(d => this.yScale(d.count)) // TO DO: shouldn't be hardcoded
      .curve(d3.curveMonotoneX);

    // svg path generator for drawing a line
    this.line = d3
      .line()
      .x(d => this.xScale(d.year_month))
      .y(d => this.yScale(d.count)) // TO DO: shouldn't be hardcoded
      .curve(d3.curveMonotoneX);
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

  handleSparkLineClick(entity) {
    const { key } = entity;
    const { secondary, primary } = this.props;

    if (!primary.key && key !== secondary.key) {
      this.props.selectPrimaryEntity(entity);
    }

    if (primary.key && key === primary.key) {
      this.props.deselectPrimaryEntity();
    }

    if (primary.key && !secondary.key && key !== primary.key) {
      this.props.selectSecondaryEntity(entity);
    }

    if (secondary.key && key === secondary.key) {
      this.props.deselectSecondaryEntity();
    }
  }

  renderSparkLines() {
    const { entityType, primary, secondary, nested, response } = this.props;
    const entityTypeDisplay = entityType.replace(/_/g, ' ');

    if (!nested || !nested.length) return null;

    // set x-scale domain, assumes data is sorted by date
    this.xScale.domain([
      d3.min(nested, c => c.values[0].year_month),
      d3.max(nested, c => c.values[c.values.length - 1].year_month),
    ]);

    // set y-scale domain
    this.yScale.domain([0, d3.max(response, d => d.count)]);

    return nested.map(entity => {
      const { key, values, rank } = entity;
      const label = +key < 10 ? `0${key}` : key;

      // class names for list items
      const listItemClass = classNames({
        'sparkline-list-item': true,
        'primary-active': key === primary.key,
        'secondary-active': key === secondary.key,
      });

      return (
        // store some data-xxx properties so we can filter on them later
        // eslint-disable-next-line
        <li
          key={key}
          data-rank-sort={rank}
          data-name-sort={+key}
          data-search={`city council ${label}`}
          className={listItemClass}
          onClick={() => this.handleSparkLineClick({ ...entity })}
        >
          <h6 style={{ padding: 0 }}>{`${entityTypeDisplay} ${label} – Rank: ${rank +
            1} / ${nested.length}`}</h6>
          <svg width={width} height={height} style={{ border: '1px solid #999' }}>
            <path fill="#e7e7e7" className="area spark" d={this.area(values)} />
            <path
              fill="none"
              strokeWidth="1.5px"
              stroke="#666"
              className="line spark"
              d={this.line(values)}
            />
          </svg>
        </li>
      );
    });
  }

  render() {
    const { sparkLineListHeight } = this.props;
    let listItems = this.renderSparkLines();
    listItems = this.filterListItems(listItems);
    this.sortListItems(listItems);

    // NOTE: sparkLineListHeight is used to explicity set the height of the sparklines list so that it is scrollable if there are lots of list items
    // this value is calculated in the Sidebar parent component (Sidebar/index.jsx) and passed down
    return (
      <ul style={{ height: sparkLineListHeight - 110 }} className="SparkLineList scroll">
        {listItems}
      </ul>
    );
  }
}

export default connect(mapStateToProps, {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
})(SparkLineList);
