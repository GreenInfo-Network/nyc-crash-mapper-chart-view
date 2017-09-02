import React, { Component } from 'react';
import PropTypes from 'prop-types';

import LineChart from './LineChart';

class LineChartsContainer extends Component {
  static propTypes = {
    primary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    secondary: PropTypes.shape({
      key: PropTypes.string,
      values: PropTypes.array,
    }).isRequired,
    nested: PropTypes.arrayOf(PropTypes.object),
  };

  static defaultProps = {
    nested: [],
  };

  render() {
    const { nested, primary, secondary } = this.props;

    return (
      <div className="LineChartsContainer">
        <LineChart {...{ nested, primary, secondary }} />
      </div>
    );
  }
}

export default LineChartsContainer;
