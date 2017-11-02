import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as actions from '../actions';
import { entityDataSelector } from '../common/reduxSelectors';
import * as pt from '../common/reactPropTypeDefs';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar/';
import LineChartsContainer from '../components/LineCharts/LineChartsContainer';
import DotGridChartsContainer from '../components/DotGridCharts/DotGridChartsContainer';
import RankCards from '../components/RankCards/';
import TimeLine from './TimeLine';
import RankCardsControls from '../components/RankCards/RankCardsControls';
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
    chartView: pt.chartView.isRequired,
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
    toggleChartView: PropTypes.func.isRequired,
    sortEntitiesByName: PropTypes.func.isRequired,
    sortEntitiesByRank: PropTypes.func.isRequired,
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

  renderChartView() {
    const { chartView, dateRanges, entityType, keyPrimary, keySecondary, width } = this.props;

    switch (chartView) {
      case 'trend':
        return <LineChartsContainer />;

      case 'compare':
        return (
          <DotGridChartsContainer
            {...{ dateRanges, entityType, keyPrimary, keySecondary, width }}
          />
        );

      case 'rank':
        return <RankCards {...{ entityType }} />;

      default:
        return null;
    }
  }

  render() {
    const {
      chartView,
      entityType,
      toggleChartView,
      sortEntitiesByRank,
      sortEntitiesByName,
    } = this.props;

    return (
      <div className="App grid-container">
        <div className="grid-area header">
          <Header {...{ toggleChartView, chartView }} />
        </div>
        <div className="grid-area sparklines">
          <Sidebar {...{ entityType }} />
        </div>
        <div className="grid-area timeline">
          {chartView === 'rank' ? (
            <RankCardsControls
              handleNameClick={sortEntitiesByName}
              handleRankClick={sortEntitiesByRank}
            />
          ) : (
            <TimeLine />
          )}
        </div>
        <div className="grid-area detailchart">{this.renderChartView()}</div>
        <div className="grid-area legend">
          <Legend />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, chartView, dateRanges, entities, data, filterType } = state;
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
    chartView,
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(App);
