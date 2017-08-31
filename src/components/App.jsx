import React, { Component } from 'react';
import PropTypes from 'prop-types';

class App extends Component {
  componentDidMount() {
    this.props.fetchEntityData();
  }

  render() {
    return (
      <div className="App">
        <h1 style={{ textTransform: 'uppercase' }}>nyc crash mapper</h1>
      </div>
    );
  }
}

App.propTypes = {
  fetchEntityData: PropTypes.func.isRequired,
};

export default App;
