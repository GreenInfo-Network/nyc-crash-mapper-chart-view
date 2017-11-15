import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setDateRangeGroupOne, setDateRangeGroupTwo } from '../actions';
import d3TimeLine from '../components/TimeLineD3';

/**
 * Class that implements a "brushable" timeline using d3
 * Two brushes control the date range filtering for two different time periods
 */
class TimeLine extends Component {
  static propTypes = {
    appWidth: PropTypes.number.isRequired,
    setDateRangeGroupOne: PropTypes.func.isRequired,
    setDateRangeGroupTwo: PropTypes.func.isRequired,
    dateRangeTwo: PropTypes.shape({
      endDate: PropTypes.instanceOf(Date),
      startDate: PropTypes.instanceOf(Date),
    }),
    dateRangeOne: PropTypes.shape({
      endDate: PropTypes.instanceOf(Date),
      startDate: PropTypes.instanceOf(Date),
    }),
  };

  static defaultProps = {
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  constructor() {
    super();
    this.svg = null;
    this.timeline = null;
    this.container = null;
    this.width = 0;
    this.height = 0;
  }

  componentDidMount() {
    const { dateRangeOne, dateRangeTwo } = this.props;
    const brushCallbacks = {
      onBrushOneEnd: this.props.setDateRangeGroupOne,
      onBrushTwoEnd: this.props.setDateRangeGroupTwo,
    };
    const dateRanges = {
      dateRangeOne,
      dateRangeTwo,
    };
    const bcr = this.container.getBoundingClientRect();
    this.width = bcr.width - 40; // account for padding left & right
    this.height = bcr.height - 42; // account for height of h6 element
    this.svg.setAttribute('width', this.width);
    this.svg.setAttribute('height', this.height);
    this.timeline = d3TimeLine(brushCallbacks, dateRanges);
    this.timeline.getSetWidth(this.width);
    this.timeline.init(this.svg);
  }

  componentDidUpdate(prevProps) {
    if (this.timeline && prevProps.appWidth !== this.props.appWidth) {
      this.updateTimeLineD3();
    }
  }

  updateTimeLineD3() {
    const { dateRangeOne, dateRangeTwo } = this.props;
    const bcr = this.container.getBoundingClientRect();
    this.width = bcr.width - 40;
    this.svg.setAttribute('width', this.width);
    this.timeline.getSetWidth(this.width);
    this.timeline.resize({ dateRangeOne, dateRangeTwo });
  }

  render() {
    return (
      <div
        ref={_ => {
          this.container = _;
        }}
        className="TimeLine"
      >
        <h6 className="title">Filter By Date Ranges</h6>
        <svg
          ref={_ => {
            this.svg = _;
          }}
        />
      </div>
    );
  }
}

const mapStateToProps = ({ browser, dateRanges }) => {
  const { width } = browser;
  const { period1, period2 } = dateRanges;
  return {
    appWidth: width,
    dateRangeOne: period1,
    dateRangeTwo: period2,
  };
};

export default connect(mapStateToProps, { setDateRangeGroupOne, setDateRangeGroupTwo })(TimeLine);
