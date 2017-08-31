import React, { Component } from 'react';
import PropTypes from 'prop-types';
import * as d3 from 'd3';

import { parseDate } from '../common/d3Utils';
import SparkLineContainer from './SparkLineContainer';

class App extends Component {
  constructor() {
    super();
    this.state = {
      dataNested: [],
    };
  }
  componentDidMount() {
    this.props.fetchEntityData();
  }

  componentWillReceiveProps(nextProps) {
    const { entityData } = nextProps;

    if (entityData.length !== this.props.entityData.length) {
      this.parseData(entityData);
    }
  }

  parseData(entityData) {
    entityData.forEach(d => {
      d.year_month = parseDate(d.year_month);
    });

    // nest the data by geographic entity
    // for sample data we're using NY City Councils, so it would be the "council" id
    const nested = d3
      .nest()
      .key(d => d.council)
      .entries(entityData);

    this.setState({
      dataNested: nested,
    });
  }

  render() {
    const { dataNested } = this.state;

    return (
      <div className="App">
        <h1 style={{ textTransform: 'uppercase' }}>nyc crash mapper</h1>
        <SparkLineContainer entities={dataNested} />
      </div>
    );
  }
}

App.propTypes = {
  entityData: PropTypes.arrayOf(PropTypes.object),
  fetchEntityData: PropTypes.func.isRequired,
};

App.defaultProps = {
  entityData: [],
};

export default App;
