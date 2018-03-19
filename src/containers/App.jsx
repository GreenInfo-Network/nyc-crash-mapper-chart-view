import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as actions from '../actions';
import { entityDataSelector } from '../common/reduxSelectors';
import { lastThreeYearsSelector } from '../common/reduxSelectorsRankedList';
import * as pt from '../common/reactPropTypeDefs';

import Header from '../components/Header';
import Sidebar from '../components/Sidebar/';
import LineChartsContainer from '../components/LineCharts/LineChartsContainer';
import DotGridChartsContainer from '../components/DotGridCharts/DotGridChartsContainer';
import RankCards from '../components/RankCards/';
import TimeLine from './TimeLine';
import RankCardsControls from '../components/RankCards/RankCardsControls';
import Legend from '../containers/Legend';
import Message from '../components/Message';
import About from '../components/About';
import Help from '../components/Help';

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
    dateRangesRank: PropTypes.shape({}),
    isFetchingData: PropTypes.number.isRequired,
    fetchEntityData: PropTypes.func.isRequired,
    setEntityType: PropTypes.func.isRequired,
    entityType: PropTypes.string,
    filterTerm: PropTypes.string,
    keyPrimary: pt.key,
    keySecondary: pt.key,
    filterType: pt.filterType.isRequired,
    anyFilterTypeSelected: PropTypes.bool.isRequired,
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
    sortEntitiesByName: PropTypes.func.isRequired,
    sortEntitiesByRank: PropTypes.func.isRequired,
    filterEntitiesByName: PropTypes.func.isRequired,
    width: PropTypes.number.isRequired,
    customGeography: pt.coordinatelist.isRequired,
  };

  static defaultProps = {
    dateRangesRank: null,
    entityData: [],
    entitiesNested: [],
    entityType: '',
    filterTerm: '',
    keyPrimary: '',
    keySecondary: '',
  };

  componentDidMount() {
    // DOM content loaded, make async data requests to start
    // starting state, entityType is citywide
    const { entityType } = this.props;
    const { customGeography } = this.props;

    // load the selected entity
    this.props.fetchEntityData(entityType);

    // we will be wanting this as our baselines for both Compare and Trend
    // for Compare we need this ASAP so the component can come up
    if (customGeography.length) {
      this.props.fetchEntityData('custom', customGeography);
    }

    // as of issue 58, we want citywide data to be had for both Trend and Compare
    // so start loading it now
    this.props.fetchEntityData('citywide');
  }

  componentWillReceiveProps(nextProps) {
    const { entityData, entityType, isFetchingData } = nextProps;

    // user toggled geographic entity and no data has been cached
    // make a API call to get the data
    if (
      entityType !== this.props.entityType &&
      this.props.entityData.length &&
      !entityData.length &&
      isFetchingData === 0
    ) {
      this.props.fetchEntityData(entityType);
    }
  }

  renderChartView() {
    const { chartView, dateRanges, entityType, keyPrimary, keySecondary } = this.props;
    const { customGeography } = this.props;
    const { width } = this.props;

    switch (chartView) {
      case 'trend':
        return <LineChartsContainer />;

      case 'compare':
        return (
          <DotGridChartsContainer
            {...{ dateRanges, entityType, keyPrimary, keySecondary, width, customGeography }}
          />
        );

      case 'rank':
        return <RankCards {...{ entityType }} />;

      case 'about':
        return <About />;

      case 'help':
        return <Help />;

      default:
        return null;
    }
  }

  renderChartArea() {
    const { isFetchingData, anyFilterTypeSelected } = this.props;
    if (isFetchingData > 0) {
      return <Message message="Loading data..." showSpinner />;
    }

    if (!anyFilterTypeSelected) {
      // don't render charts if no crash types are selected
      return <Message message="Select one or more crash filter types" />;
    }

    return this.renderChartView();
  }

  render() {
    const {
      chartView,
      dateRangesRank,
      entityType,
      sortEntitiesByRank,
      sortEntitiesByName,
      filterEntitiesByName,
      filterTerm,
    } = this.props;

    return (
      <div className="App grid-container">
        <div className="grid-left">
          <div className="header">
            <Header />
          </div>
          <div className="timeline">
            {chartView === 'rank' ? (
              <RankCardsControls
                handleNameClick={sortEntitiesByName}
                handleRankClick={sortEntitiesByRank}
                dateRanges={dateRangesRank}
              />
            ) : (
              <TimeLine />
            )}
          </div>
          <div className="detailchart">{this.renderChartArea()}</div>
          <div className="legend">
            <Legend />
          </div>
        </div>
        <div className="grid-right">
          <Sidebar {...{ entityType, filterTerm, filterEntitiesByName }} />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, chartView, dateRanges, entities, data, filterType, customGeography } = state;
  const { isFetchingData } = data;
  const entityData = entityDataSelector(state);

  // boolean that states whether or not any crash type filters are selected
  // used to display a message to user
  let anyFilterTypeSelected = false;

  Object.keys(filterType).forEach(key => {
    if (key !== 'noInjuryFatality') {
      const harmType = filterType[key];

      Object.keys(harmType).forEach(personType => {
        if (harmType[personType]) {
          anyFilterTypeSelected = true;
        }
      });
    }
  });

  return {
    width: browser.width,
    height: browser.height,
    dateRangesRank: entityData.response.length ? lastThreeYearsSelector(state) : null,
    dateRanges,
    isFetchingData,
    entityData: entityData.response,
    entityType: entities.entityType,
    keyPrimary: entities.primary.key,
    keySecondary: entities.secondary.key,
    filterType,
    filterTerm: entities.filterTerm,
    chartView,
    anyFilterTypeSelected,
    customGeography,
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(App);
