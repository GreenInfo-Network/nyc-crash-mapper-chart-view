import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import LineChart from '../components/LineChart';

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
    nested: [],
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  render() {
    const { nested, primary, secondary, dateRangeOne, dateRangeTwo } = this.props;

    return (
      <div className="LineChartsContainer">
        <LineChart {...{ nested, primary, secondary }} {...dateRangeOne} />
        <LineChart {...{ nested, primary, secondary }} {...dateRangeTwo} />
      </div>
    );
  }
}

const mapStateToProps = ({ data, entities, dateRanges }) => ({
  nested: data.nested,
  primary: entities.primary,
  secondary: entities.secondary,
  dateRangeOne: dateRanges.group1,
  dateRangeTwo: dateRanges.group2,
});

export default connect(mapStateToProps, null)(LineChartsContainer);
