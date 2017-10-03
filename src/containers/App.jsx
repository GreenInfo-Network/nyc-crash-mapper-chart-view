import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as actions from '../actions';
import { allEntityData } from '../reducers';

import Sidebar from '../components/Sidebar/';
import LineChartsContainer from './LineChartsContainer';
import TimeLine from './TimeLine';

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
    isFetching: PropTypes.bool.isRequired,
    entitiesNested: PropTypes.arrayOf(PropTypes.object),
    fetchEntityData: PropTypes.func.isRequired,
    setEntityType: PropTypes.func.isRequired,
    entityType: PropTypes.string,
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityData: [],
    entitiesNested: [],
    entityType: '',
  };

  componentDidMount() {
    // DOM content loaded, make async data requests
    // TO DO: entity type should be set via a URL param
    this.props.setEntityType('city_council');
    this.props.fetchEntityData('city_council');
    // always request citywide data for the line charts, regardless of current entityType
    this.props.fetchEntityData('citywide');
  }

  componentWillReceiveProps(nextProps) {
    const { entityData, isFetching } = nextProps;

    // user toggled geographic entity and no data has been cached
    // make a API call to get the data
    if (this.props.entityData.length && !entityData.length && !isFetching) {
      this.props.fetchEntityData();
    }
  }

  render() {
    const { entitiesNested, entityType, isFetching } = this.props;

    return (
      <div className="App grid-container">
        <div className="grid-area header">
          <h3 style={{ textTransform: 'uppercase', display: 'inline-block' }}>nyc crash mapper</h3>
        </div>
        <div className="grid-area sparklines">
          <Sidebar {...{ entitiesNested, entityType }} />
        </div>
        <div className="grid-area timeline">
          <TimeLine />
        </div>
        <div className="grid-area detailchart">
          {/* TO DO: use a real loading indicator */}
          {isFetching && <h3>Loading...</h3>}
          <LineChartsContainer />
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, entities, data } = state;
  const { isFetching } = data;
  const entityData = allEntityData(state);

  return {
    width: browser.width,
    height: browser.height,
    isFetching,
    entityData: entityData.response,
    entitiesNested: entityData.nested,
    entityType: entities.entityType,
  };
};

export default connect(mapStateToProps, {
  ...actions,
})(App);
