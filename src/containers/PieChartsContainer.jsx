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
    appHeight: PropTypes.number.isRequired,
    appWidth: PropTypes.number.isRequired,
    entity: PropTypes.string,
    entityType: PropTypes.string,
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
    entity: '',
    entityType: '',
    nested: [],
    dateRangeOne: {},
    dateRangeTwo: {},
  };

  render() {
    const { appWidth, appHeight, valuesDateRange1, valuesDateRange2, entityType } = this.props;
    const { primary, secondary } = valuesDateRange1;

    // TO DO: refactor this markup!!!
    return (
      <div className="PieChartsContainer">
        <div className="period-two">
          <div className="primary-container">
            <div className="title-labels">
              <h6 className="label--title">
                {primary.key ? `${entityType} ${primary.key}` : null}
              </h6>
              <h6 className="label--total">{primary.key ? 'Total:' : null}</h6>
            </div>
            <div className="charts">
              <PieChart
                category="injuries"
                values={valuesDateRange2.primary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
              <PieChart
                category="fatalities"
                values={valuesDateRange2.primary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
            </div>
          </div>
          <div className="secondary-container">
            <div className="title-labels">
              <h6 className="label--title">
                {secondary.key ? `${entityType} ${secondary.key}` : null}
              </h6>
              <h6 className="label--total">{secondary.key ? 'Total:' : null}</h6>
            </div>
            <div className="charts">
              <PieChart
                category="injuries"
                values={valuesDateRange2.secondary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
              <PieChart
                category="fatalities"
                values={valuesDateRange2.secondary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
            </div>
          </div>
        </div>
        <div className="period-one">
          <div className="primary-container">
            <div className="title-labels">
              <h6 className="label--title">
                {primary.key ? `${entityType} ${primary.key}` : null}
              </h6>
              <h6 className="label--total">{primary.key ? 'Total:' : null}</h6>
            </div>
            <div className="charts">
              <PieChart
                category="injuries"
                values={valuesDateRange1.primary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
              <PieChart
                category="fatalities"
                values={valuesDateRange1.primary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
            </div>
          </div>
          <div className="secondary-container">
            <div className="title-labels">
              <h6 className="label--title">
                {secondary.key ? `${entityType} ${secondary.key}` : null}
              </h6>
              <h6 className="label--total">{secondary.key ? 'Total:' : null}</h6>
            </div>
            <div className="charts">
              <PieChart
                category="injuries"
                values={valuesDateRange1.secondary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
              <PieChart
                category="fatalities"
                values={valuesDateRange1.secondary.values}
                appWidth={appWidth}
                appHeight={appHeight}
              />
            </div>
          </div>
        </div>
      </div>
    );
  }
}

const mapStateToProps = state => {
  const { browser, entities } = state;
  const { width, height } = browser;
  const entitiesValuesFiltered = filterEntitiesValues(state);
  const { valuesDateRange1, valuesDateRange2 } = entitiesValuesFiltered;

  return {
    appHeight: height,
    appWidth: width,
    entityType: entities.entityType,
    valuesDateRange1,
    valuesDateRange2,
  };
};

export default connect(mapStateToProps, null)(PieChartsContainer);
