import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import classNames from 'classnames';
import axios from 'axios';

import { selectPrimaryEntity, selectSecondaryEntity } from '../actions';
import toggleEntity from '../common/toggleEntity';
import { entityDataSelector } from '../common/reduxSelectors';
import rankedListSelector from '../common/reduxSelectorsRankedList';
import * as pt from '../common/reactPropTypeDefs';
import { entityIdDisplay, entityNameDisplay } from '../common/labelFormatters';
import { sqlNameByGeoAndIdentifier } from '../common/sqlQueries.js';

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

const mapDispatchToProps = dispatch => ({
  dispatch,
  selectPrimaryEntity: entity => dispatch(selectPrimaryEntity(entity)),
  selectSecondaryEntity: entity => dispatch(selectSecondaryEntity(entity)),
});

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
    sparkLineListHeight: PropTypes.number,
    selectPrimaryEntity: PropTypes.func.isRequired,
    selectSecondaryEntity: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    response: [],
    filterTerm: '',
    sparkLineListHeight: null,
  };

  constructor(props) {
    super(props);
    this.renderListItems = this.renderListItems.bind(this);
    this.handleListItemClick = this.handleListItemClick.bind(this);
  }

  componentDidMount() {
    const { primary, entityType, response } = this.props;

    // hack re issue 97; try and resolve an entity identifier from the Map
    // which uses a totally different format: just the numeric ID, just the neighborhood name, etc.
    // and we need to convert that to Chart format e.g. "Borough, Full Area Name 123"
    //
    // &primary= is the area identifier, perhaps in Map format
    // and it's not straightforward to know what areas are "Map format" cuz Chart format is free text
    // and we may be reading URLs that don't need the &primary fixed, e.g. from Chart

    let find_name_sql = '';
    if (typeof primary.key === 'number') {
      // all numeric = we know it needs to be resolved cuz it didn't come from Chart
      // this is the majority of area types, when coming from Map
      find_name_sql = sqlNameByGeoAndIdentifier(entityType, primary.key);
    } else if (
      entityType === 'neighborhood' &&
      typeof primary.key === 'string' &&
      primary.key.indexOf(',') === -1
    ) {
      // neighborhood and no comma = look up, Chart always adds borough-comma
      find_name_sql = sqlNameByGeoAndIdentifier(entityType, primary.key);
    }
    // else, the name is fine as-is; basically this means borough and intersection

    if (find_name_sql) {
      axios({
        method: 'get',
        params: {
          q: find_name_sql,
        },
      }).then(result => {
        if (result.data.rows) {
          const newidentifier = result.data.rows[0].areaname;

          this.props.selectPrimaryEntity({
            key: newidentifier,
            values: response.filter(d => d[entityType] === entityType),
          });
        }
      });
    }
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

  handleListItemClick(key) {
    toggleEntity(key, this.props);
  }

  renderListItems() {
    // eslint-disable-next-line
    const { entityType, primary, secondary, ranked, response } = this.props;

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
        const idkey = entityIdDisplay(entityType, key);
        const namelabel = entityNameDisplay(entityType, key);

        // class names for list items
        const listItemClass = classNames({
          'select-areas-list-item': true,
          'primary-active': key === primary.key,
          'secondary-active': key === secondary.key,
        });

        return (
          // data-search is used by filterListItems() and should be the readable label
          // eslint-disable-next-line
          <li
            key={idkey}
            data-search={`${namelabel}`}
            className={listItemClass}
            onClick={() => this.handleListItemClick(key)}
          >
            <h6 style={{ padding: 0 }}>{namelabel}</h6>
          </li>
        );
      });
  }

  render() {
    const { sparkLineListHeight } = this.props;
    let listItems = this.renderListItems();
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

export default connect(mapStateToProps, mapDispatchToProps)(SelectAreasList);
