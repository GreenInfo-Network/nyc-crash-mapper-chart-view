import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as pt from '../common/reactPropTypeDefs';
import { filterEntitiesValues } from '../reducers';
import DotGridChart from '../components/DotGridChart';

const mapStateToProps = state => {
  const { filterType } = state;
  const { valuesDateRange1, valuesDateRange2 } = filterEntitiesValues(state);
  return {
    filterType,
    valuesDateRange1,
    valuesDateRange2,
  };
};

class DotGridChartsContainer extends Component {
  render() {
    const { valuesDateRange1, valuesDateRange2, filterType } = this.props;

    return (
      <div className="DotGridChartsContainer">
        <div>
          <DotGridChart filterType={filterType} entity={valuesDateRange1.primary} />
          <DotGridChart filterType={filterType} entity={valuesDateRange2.primary} />
        </div>
        <div>
          <DotGridChart filterType={filterType} entity={valuesDateRange1.secondary} />
          <DotGridChart filterType={filterType} entity={valuesDateRange2.secondary} />
        </div>
      </div>
    );
  }
}

DotGridChartsContainer.propTypes = {
  filterType: pt.filterType.isRequired,
  valuesDateRange1: pt.valuesByDateRange.isRequired,
  valuesDateRange2: pt.valuesByDateRange.isRequired,
};

// DotGridChartsContainer.defaultProps = {
//   valuesDateRange1: { values: [] },
//   valuesDateRange2: { values: [] },
// };

export default connect(mapStateToProps, null)(DotGridChartsContainer);
