import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

/**
 * Connected Component that houses D3 Pie Chart graphs
 */
class PieChartsContainer extends Component {
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
    return (
      <div className="PieChartsContainer">
        <h4>Pie Charts Here</h4>
      </div>
    );
  }
}

const mapStateToProps = ({ data, entities, dateRanges }) => {
  const { nested } = data;
  const { primary, secondary } = entities;
  const { group1, group2 } = dateRanges;
  return {
    nested,
    primary,
    secondary,
    dateRangeOne: group1,
    dateRangeTwo: group2,
  };
};

export default connect(mapStateToProps, null)(PieChartsContainer);
