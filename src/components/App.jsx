import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineContainer from './SparkLineContainer';
import LineChartsContainerConnected from '../containers/LineChartsContainerConnected';
import EntitySelections from '../containers/EntitySelections';

class App extends Component {
  static propTypes = {
    entityData: PropTypes.arrayOf(PropTypes.object),
    entitiesNested: PropTypes.arrayOf(PropTypes.object),
    fetchEntityData: PropTypes.func.isRequired,
    setEntityType: PropTypes.func.isRequired,
    entityType: PropTypes.string,
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
        <div className="grid-area detailchart">
          <LineChartsContainerConnected />
        </div>
        <div className="grid-area timeline" />
        <div className="grid-area barchart" />
      </div>
    );
  }
}

export default App;
