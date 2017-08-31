import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineList from './SparkLineList';

class SparkLineContainer extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
  };

  render() {
    const { entities } = this.props;

    return (
      <div className="SparkLineContainer">
        <input type="search" />
        <div
          style={{
            height: '100%',
            maxHeight: '600px',
          }}
          className="SparkLineList scroll"
        >
          <SparkLineList {...{ entities }} />
        </div>
      </div>
    );
  }
}

export default SparkLineContainer;
