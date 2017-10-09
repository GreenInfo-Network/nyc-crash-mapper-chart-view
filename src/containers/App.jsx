import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';
import isEqual from 'lodash.isequal';

import * as actions from '../actions';
import { allEntityData } from '../reducers';
import * as pt from '../common/reactPropTypeDefs';

import Sidebar from '../components/Sidebar/';
import LineChartsContainer from './LineChartsContainer';
import TimeLine from './TimeLine';
import Legend from '../components/Legend';

// for debugging & messing around
window.d3 = d3;

/**
 * Class that houses all components for the Application
 * Splits UI into separate areas using CSS classes that correspond with CSS Grid layout
 * Handles making Carto API calls for geographies / entities
*/
class App extends Component {
  static propTypes = {
    entityData: PropTypes.arrayOf(PropTypes.object),
    isFetchingCharts: PropTypes.bool.isRequired,
    isFetchingRanked: PropTypes.bool.isRequired,
    fetchEntityData: PropTypes.func.isRequired,
    fetchRankData: PropTypes.func.isRequired,
    setEntityType: PropTypes.func.isRequired,
    entityType: PropTypes.string,
    filterType: pt.filterType.isRequired,
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityData: [],
    entitiesNested: [],
    entityType: '',
  };

  componentDidMount() {
    const { entityType, filterType } = this.props;
    // DOM content loaded, make async data requests
    this.props.fetchEntityData(entityType);
    this.props.fetchRankData(entityType, filterType);

    // always request citywide data for the line charts, regardless of current entityType
    this.props.fetchEntityData('citywide');
  }

  componentWillReceiveProps(nextProps) {
    const { entityData, entityType, filterType, isFetchingCharts, isFetchingRanked } = nextProps;

    // user toggled geographic entity and no data has been cached
    // make a API call to get the data
    if (
      entityType !== this.props.entityType &&
      this.props.entityData.length &&
      !entityData.length &&
      !isFetchingCharts &&
      !isFetchingRanked
    ) {
      this.props.fetchEntityData(entityType);
      this.props.fetchRankData(entityType, filterType);
    }

    if (!isEqual(filterType, this.props.filterType)) {
      // if selected crash filters change, update the sparklines list
      this.props.fetchRankData(entityType, filterType);
    }
  }

  render() {
    const { entityType, isFetchingRanked } = this.props;

    return (
      <div className="App grid-container">
        <div className="grid-area header">
          <h3 style={{ textTransform: 'uppercase', display: 'inline-block' }}>nyc crash mapper</h3>
        </div>
        <div className="grid-area sparklines">
          <Sidebar {...{ entityType, isFetchingRanked }} />
        </div>
        <div className="grid-area timeline">
          <TimeLine />
        </div>
        <div className="grid-area detailchart">
          <LineChartsContainer />
        </div>
        <div className="grid-area legend">
          <Legend />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, entities, data, filterType } = state;
  const { isFetchingCharts, isFetchingRanked } = data;
  const entityData = allEntityData(state);

  return {
    width: browser.width,
    height: browser.height,
    isFetchingCharts,
    isFetchingRanked,
    entityData: entityData.response,
    entityType: entities.entityType,
    filterType,
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(App);
