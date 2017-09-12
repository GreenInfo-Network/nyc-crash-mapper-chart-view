import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import * as actions from '../actions';

import SparkLineContainer from '../components/SparkLineContainer';
import LineChartsContainer from './LineChartsContainer';
import EntitySelections from './EntitySelections';
import TimeLine from './TimeLine';

// for debugging & messing around
window.d3 = d3;

class App extends Component {
  static propTypes = {
    entityData: PropTypes.arrayOf(PropTypes.object),
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
    this.props.setEntityType('City Council District');
    this.props.fetchEntityData();
  }

  render() {
    const { entitiesNested, entityType } = this.props;

    return (
      <div className="App grid-container">
        <div className="grid-area header">
          <h3 style={{ textTransform: 'uppercase' }}>nyc crash mapper</h3>
        </div>
        <div className="grid-area sparklines">
          <SparkLineContainer entities={entitiesNested} entityType={entityType} />
        </div>
        <div className="grid-area entity-selectors">
          <EntitySelections />
        </div>
        <div className="grid-area timeline">
          <TimeLine />
        </div>
        <div className="grid-area detailchart">
          <LineChartsContainer />
        </div>
        <div className="grid-area piecharts" />
      </div>
    );
  }
}

const mapStateToProps = ({ browser, data, entities }) => ({
  width: browser.width,
  height: browser.height,
  entityData: data.response,
  entitiesNested: data.nested,
  entityType: entities.entityType,
});

export default connect(mapStateToProps, {
  ...actions,
})(App);
