import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

import { filterEntitiesValues } from '../reducers';
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
    const {
      nested,
      primary,
      secondary,
      dateRangeOne,
      dateRangeTwo,
      valuesDateRange1,
      valuesDateRange2,
    } = this.props;

    return (
      <div className="LineChartsContainer">
        <LineChart
          nested={nested}
          keyPrimary={primary.key}
          keySecondary={secondary.key}
          {...dateRangeOne}
          valuesByDateRange={valuesDateRange1}
        />
        <LineChart
          nested={nested}
          keyPrimary={primary.key}
          keySecondary={secondary.key}
          {...dateRangeTwo}
          valuesByDateRange={valuesDateRange2}
        />
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { data, entities, dateRanges } = state;
  const entitiesValuesFiltered = filterEntitiesValues(state);
  const { valuesDateRange1, valuesDateRange2 } = entitiesValuesFiltered;
  return {
    nested: data.nested,
    primary: entities.primary,
    secondary: entities.secondary,
    dateRangeOne: dateRanges.group1,
    dateRangeTwo: dateRanges.group2,
    valuesDateRange1,
    valuesDateRange2,
  };
};

export default connect(mapStateToProps, null)(LineChartsContainer);
