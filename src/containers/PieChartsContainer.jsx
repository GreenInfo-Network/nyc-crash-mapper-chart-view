import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import PieChart from '../components/PieChart';

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
  };

  static defaultProps = {
    nested: [],
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  render() {
    const { primary, secondary } = this.props;
    const pieSize = 150;

    return (
      <div className="PieChartsContainer">
        <div className="primary-container">
          <PieChart category="injuries" values={primary.values} width={pieSize} height={pieSize} />
          <PieChart
            category="fatalities"
            values={primary.values}
            width={pieSize}
            height={pieSize}
          />
        </div>
        <div className="secondary-container">
          <PieChart
            category="injuries"
            values={secondary.values}
            width={pieSize}
            height={pieSize}
          />
          <PieChart
            category="fatalities"
            values={secondary.values}
            width={pieSize}
            height={pieSize}
          />
        </div>
      </div>
    );
  }
}

const mapStateToProps = ({ entities }) => {
  const { primary, secondary } = entities;
  return {
    primary,
    secondary,
  };
};

export default connect(mapStateToProps, null)(PieChartsContainer);
