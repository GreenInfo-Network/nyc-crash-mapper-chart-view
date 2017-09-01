import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineContainer from './SparkLineContainer';

class App extends Component {
  static propTypes = {
    entityData: PropTypes.arrayOf(PropTypes.object),
    entitiesNested: PropTypes.arrayOf(PropTypes.object),
    fetchEntityData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityData: [],
    entitiesNested: [],
  };

  componentDidMount() {
    this.props.fetchEntityData();
  }

  render() {
    const { entitiesNested } = this.props;

    return (
      <div className="App">
        <h1 style={{ textTransform: 'uppercase' }}>nyc crash mapper</h1>
        <SparkLineContainer entities={entitiesNested} />
      </div>
    );
  }
}

export default App;
