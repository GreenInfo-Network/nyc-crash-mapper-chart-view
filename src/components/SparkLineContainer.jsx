import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineList from './SparkLineList';

class SparkLineContainer extends Component {
  static propTypes = {
    // eslint-disable-next-line
    entities: PropTypes.arrayOf(PropTypes.object),
  };

  constructor() {
    super();
    this.state = {
      inputValue: '',
    };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      inputValue: event.target.value,
    });
  }

  render() {
    const { entities } = this.props;
    const { inputValue } = this.state;

    return (
      <div className="SparkLineContainer">
        <input value={inputValue} onChange={this.handleChange} type="text" />
        <div
          style={{
            height: '100%',
            maxHeight: '600px',
          }}
          className="SparkLineList scroll"
        >
          <SparkLineList filterTerm={inputValue} {...{ entities }} />
        </div>
      </div>
    );
  }
}

export default SparkLineContainer;
