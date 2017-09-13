import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterEntitiesValues } from '../reducers';
import PieChart from '../components/PieChart';

/**
 * Connected Component that houses D3 Pie Chart graphs for both entities & date ranges
 */
class PieChartsContainer extends Component {
  static propTypes = {
    valuesDateRange1: PropTypes.shape({
      primary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
      secondary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
    }).isRequired,
    valuesDateRange2: PropTypes.shape({
      primary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
      secondary: PropTypes.shape({
        key: PropTypes.string,
        values: PropTypes.array,
      }),
    }).isRequired,
  };

  static defaultProps = {
    nested: [],
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  render() {
    const { valuesDateRange1, valuesDateRange2 } = this.props;
    const pieSize = 150;

    return (
      <div className="PieChartsContainer">
        <div className="period-one">
          <div className="primary-container">
            <PieChart
              category="injuries"
              values={valuesDateRange1.primary.values}
              width={pieSize}
              height={pieSize}
            />
            <PieChart
              category="fatalities"
              values={valuesDateRange1.primary.values}
              width={pieSize}
              height={pieSize}
            />
          </div>
          <div className="secondary-container">
            <PieChart
              category="injuries"
              values={valuesDateRange1.secondary.values}
              width={pieSize}
              height={pieSize}
            />
            <PieChart
              category="fatalities"
              values={valuesDateRange1.secondary.values}
              width={pieSize}
              height={pieSize}
            />
          </div>
        </div>
        <div className="period-two">
          <div className="primary-container">
            <PieChart
              category="injuries"
              values={valuesDateRange2.primary.values}
              width={pieSize}
              height={pieSize}
            />
            <PieChart
              category="fatalities"
              values={valuesDateRange2.primary.values}
              width={pieSize}
              height={pieSize}
            />
          </div>
          <div className="secondary-container">
            <PieChart
              category="injuries"
              values={valuesDateRange2.secondary.values}
              width={pieSize}
              height={pieSize}
            />
            <PieChart
              category="fatalities"
              values={valuesDateRange2.secondary.values}
              width={pieSize}
              height={pieSize}
            />
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const entitiesValuesFiltered = filterEntitiesValues(state);
  const { valuesDateRange1, valuesDateRange2 } = entitiesValuesFiltered;

  return {
    valuesDateRange1,
    valuesDateRange2,
  };
};

export default connect(mapStateToProps, null)(PieChartsContainer);
