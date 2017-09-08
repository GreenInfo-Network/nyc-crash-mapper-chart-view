import React, { Component } from 'react';
import PropTypes from 'prop-types';

import d3TimeLine from './TimeLineD3';

// TO DO share same set of margin, width, & height values
// ideally width & height will be set by the component's parent size
// and should be updated when the viewport changes
const margin = {
  top: 10,
  right: 0,
  bottom: 20,
  left: 0,
};
const width = 960 - margin.left - margin.right;
const height = 100 - margin.top - margin.bottom;

/**
 * Class that implements a "brushable" timeline using d3
 * Two brushes control the date range filtering for two different time periods
 */
class TimeLine extends Component {
  static propTypes = {
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.svg = null;
    this.timeline = null;
  }

  componentDidMount() {
    this.timeline = d3TimeLine()(this.svg);
  }

  render() {
    return (
      <div className="TimeLine">
        <svg
          ref={_ => {
            this.svg = _;
          }}
          width={width + margin.left + margin.right}
          height={height + margin.top + margin.bottom}
        />
      </div>
    );
  }
}

export default TimeLine;
