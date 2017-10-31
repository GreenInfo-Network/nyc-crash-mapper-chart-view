import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as actions from '../actions';
import { entityDataSelector } from '../common/reduxSelectors';
import * as pt from '../common/reactPropTypeDefs';

import Sidebar from '../components/Sidebar/';
import LineChartsContainer from '../components/LineCharts/LineChartsContainer';
import DotGridChartsContainer from '../components/DotGridCharts/DotGridChartsContainer';
import TimeLine from './TimeLine';
import Legend from '../containers/Legend';

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
    dateRanges: pt.dateRanges.isRequired,
    isFetchingCharts: PropTypes.bool.isRequired,
    fetchEntityData: PropTypes.func.isRequired,
    setEntityType: PropTypes.func.isRequired,
    entityType: PropTypes.string,
    keyPrimary: pt.key,
    keySecondary: pt.key,
    filterType: pt.filterType.isRequired,
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
    trendCompare: pt.trendCompare.isRequired,
    width: PropTypes.number.isRequired,
  };

  static defaultProps = {
    entityData: [],
    entitiesNested: [],
    entityType: '',
    keyPrimary: '',
    keySecondary: '',
  };

  componentDidMount() {
    const { entityType } = this.props;
    // DOM content loaded, make async data requests
    this.props.fetchEntityData(entityType);
  }

  componentWillReceiveProps(nextProps) {
    const { entityData, entityType, isFetchingCharts } = nextProps;

    // user toggled geographic entity and no data has been cached
    // make a API call to get the data
    if (
      entityType !== this.props.entityType &&
      this.props.entityData.length &&
      !entityData.length &&
      !isFetchingCharts
    ) {
      this.props.fetchEntityData(entityType);
    }
  }

  render() {
    const { dateRanges, entityType, trendCompare, width, keyPrimary, keySecondary } = this.props;
    const { trend } = trendCompare;

    return (
      <div className="App grid-container">
        <div className="grid-area header">
          <h3 style={{ textTransform: 'uppercase', display: 'inline-block' }}>nyc crash mapper</h3>
        </div>
        <div className="grid-area sparklines">
          <Sidebar {...{ entityType }} />
        </div>
        <div className="grid-area timeline">
          <TimeLine />
        </div>
        <div className="grid-area detailchart">
          {trend ? (
            <LineChartsContainer />
          ) : (
            <DotGridChartsContainer
              {...{ dateRanges, entityType, keyPrimary, keySecondary, width }}
            />
          )}
        </div>
        <div className="grid-area legend">
          <Legend />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, dateRanges, entities, data, filterType, trendCompare } = state;
  const { isFetchingCharts } = data;
  const entityData = entityDataSelector(state);

  return {
    width: browser.width,
    height: browser.height,
    dateRanges,
    isFetchingCharts,
    entityData: entityData.response,
    entityType: entities.entityType,
    keyPrimary: entities.primary.key,
    keySecondary: entities.secondary.key,
    filterType,
    trendCompare,
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(App);
