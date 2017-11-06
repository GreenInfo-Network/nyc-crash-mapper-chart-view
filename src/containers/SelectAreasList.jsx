import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';

import {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
} from '../actions';

import { entityDataSelector } from '../common/reduxSelectors';
import rankedListSelector from '../common/reduxSelectorsRankedList';
import * as pt from '../common/reactPropTypeDefs';

const mapStateToProps = state => {
  const { entities, filterType } = state;
  const { entityType, filterTerm } = entities;
  const { response } = entityDataSelector(state);
  const ranked = response && response.length ? rankedListSelector(state) : null;

  return {
    entityType,
    filterType,
    filterTerm,
    response,
    ranked: ranked || [],
    primary: entities.primary,
    secondary: entities.secondary,
  };
};

/**
  * Connected Component that renders a list of geo entities
  * This component is also responsible for setting the primary and secondary geographic entities
*/
class SelectAreasList extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterType: pt.filterType.isRequired,
    primary: pt.entity.isRequired,
    secondary: pt.entity.isRequired,
    ranked: PropTypes.arrayOf(PropTypes.object).isRequired,
    response: PropTypes.arrayOf(PropTypes.object),
    filterTerm: PropTypes.string,
    selectPrimaryEntity: PropTypes.func.isRequired,
    deselectPrimaryEntity: PropTypes.func.isRequired,
    selectSecondaryEntity: PropTypes.func.isRequired,
    deselectSecondaryEntity: PropTypes.func.isRequired,
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
    this.renderSparkLines = this.renderSparkLines.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { secondary, primary, response, entityType } = nextProps;

    // if the app loads with a primary or secondary key specfied, and we receive an async response
    // make sure to populate state.entities[type].values
    if (response.length && !this.props.response.length) {
      const entity = {};

      if (primary.key) {
        entity.key = primary.key;
        entity.values = response.filter(d => d[entityType] === primary.key);
        this.props.selectPrimaryEntity(entity);
      }

      if (secondary.key) {
        entity.key = secondary.key;
        entity.values = response.filter(d => d[entityType] === secondary.key);
        this.props.selectSecondaryEntity(entity);
      }
    }
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

  handleSparkLineClick(key) {
    // when a user clicks a sparkline list item, pass that entity's data off to the redux store
    // so that it may be used by the line and dot grid charts
    const { secondary, primary, response, entityType } = this.props;
    const entity = {};
    entity.key = key;
    entity.values = response.filter(d => d[entityType] === key);

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
    // eslint-disable-next-line
    const { entityType, primary, secondary, ranked, response } = this.props;
    const entityTypeDisplay = entityType.replace(/_/g, ' ');

    if (!ranked.length) return null;

    // resorting ranked here in case we decide to add sorting back later
    return ranked
      .sort((a, b) => {
        if (typeof a.key === 'number') {
          return a.key - b.key;
        }

        if (a.key > b.key) {
          return 1;
        }

        if (a.key < b.key) {
          return -1;
        }

        return 0;
      })
      .map(entity => {
        const { key } = entity;
        let label;

        if (typeof +key === 'number') {
          label = +key < 10 ? `0${key}` : key;
        } else {
          label = key;
        }

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
            key={label}
            data-search={`city council ${label}`}
            className={listItemClass}
            onClick={() => this.handleSparkLineClick(key)}
          >
            <h6 style={{ padding: 0 }}>{`${entityTypeDisplay} ${label}`}</h6>
          </li>
        );
      });
  }

  render() {
    const { sparkLineListHeight } = this.props;
    let listItems = this.renderSparkLines();
    listItems = this.filterListItems(listItems);

    // NOTE: sparkLineListHeight is used to explicity set the height of the sparklines list so that it is scrollable if there are lots of list items
    // this value is calculated in the Sidebar parent component (Sidebar/index.jsx) and passed down
    return (
      <ul style={{ height: sparkLineListHeight - 110 }} className="SelectAreasList scroll">
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
})(SelectAreasList);
