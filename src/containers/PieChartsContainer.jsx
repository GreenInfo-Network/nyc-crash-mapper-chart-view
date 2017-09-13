import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { sum } from 'd3';

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

  constructor() {
    super();
    this.state = {
      data: [],
    };
  }

  componentWillReceiveProps(nextProps) {
    const { primary } = nextProps;
    if (nextProps.primary.values.length && primary.key !== this.props.primary.key) {
      this.formatData(nextProps.primary.values);
    }
  }

  formatData(values) {
    // create a new data structure to pass to the pie chart
    const newData = {
      values: [],
      total: null,
    };

    newData.values.push({
      type: 'pedestrian',
      injuries: sum(values, d => d.pedestrian_injured),
    });

    newData.values.push({
      type: 'cyclist',
      injuries: sum(values, d => d.cyclist_injured),
    });

    newData.values.push({
      type: 'motorist',
      injuries: sum(values, d => d.motorist_injured),
    });

    // store a sum for the label of the bottom of the pie chart
    newData.total = sum(newData.values, d => d.injuries);

    // re-render to render piechart
    this.setState({
      data: newData,
    });
  }

  render() {
    const { data } = this.state;
    return (
      <div className="PieChartsContainer">
        <PieChart data={data} width={150} height={150} />
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
