import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import { entityNameDisplay, entityTypeDisplay } from '../../common/labelFormatters';
import { findDateDiffInMonths, formatDate } from '../../common/d3Utils';
import PieChartTitle from './PieChartTitle';
import PieChartSums from '../../containers/PieChartSums';
import PieChartWrapper from '../../containers/PieChartWrapper';

class PieChartsContainer extends Component {
  static propTypes = {
    dateRanges: pt.dateRange.isRequired,
    entityType: PropTypes.string.isRequired,
    keyPrimary: pt.key,
    keySecondary: pt.key,
    width: PropTypes.number.isRequired,
    customGeography: pt.coordinatelist.isRequired,
  };

  static defaultProps = {
    keyPrimary: '',
    keySecondary: '',
  };

  render() {
    const { keyPrimary, keySecondary, entityType, dateRanges } = this.props;
    const { period1, period2 } = dateRanges;

    const entityLabel = entityTypeDisplay(entityType);
    const keyLabelPrimary = entityNameDisplay(entityType, keyPrimary);
    const keyLabelSecondary = entityNameDisplay(entityType, keySecondary);

    const howmanymonths1 = findDateDiffInMonths(period1.startDate, period1.endDate);
    const monthsword1 = howmanymonths1 > 1 ? 'months' : 'month';

    const howmanymonths2 = findDateDiffInMonths(period2.startDate, period2.endDate);
    const monthsword2 = howmanymonths2 > 1 ? 'months' : 'month';

    const periodsHeader = (
      <div className="pie-grid-row">
        <div className="PieGridPeriodsHeader">
          <h5>{`${formatDate(period1.startDate)} – ${formatDate(period1.endDate)}`}</h5>
          <h6>
            Period A &nbsp;
            <span>
              ({howmanymonths1} {monthsword1})
            </span>
          </h6>
        </div>
        <div className="PieGridPeriodsHeader">
          <h5>{`${formatDate(period2.startDate)} – ${formatDate(period2.endDate)}`}</h5>
          <h6>
            Period B &nbsp;
            <span>
              ({howmanymonths2} {monthsword2})
            </span>
          </h6>
        </div>
      </div>
    );

    return (
      <div className="PieChartsContainer scroll">
        {periodsHeader}
        {keyPrimary && (
          <PieChartTitle keyLabel={keyLabelPrimary} {...{ keyPrimary, dateRanges, entityLabel }} />
        )}
        {keyPrimary && (
          <div className="pie-chart-row">
            <PieChartSums entityType={'primary'} period={'period1'} damageType={'injured'} />
            <PieChartSums entityType={'primary'} period={'period2'} damageType={'injured'} />
          </div>
        )}
        {keyPrimary && (
          <div className="pie-chart-row">
            <PieChartWrapper
              entityType={'primary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              width={this.width}
              damageType="injured"
            />
            <PieChartWrapper
              entityType={'primary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              width={this.width}
              damageType="injured"
            />
          </div>
        )}
        {keyPrimary && (
          <div className="pie-chart-row">
            <PieChartSums entityType={'primary'} period={'period1'} damageType={'killed'} />
            <PieChartSums entityType={'primary'} period={'period2'} damageType={'killed'} />
          </div>
        )}
        {keyPrimary && (
          <div className="pie-chart-row">
            <PieChartWrapper
              entityType={'primary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              width={this.width}
              damageType="killed"
            />
            <PieChartWrapper
              entityType={'primary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              width={this.width}
              damageType="killed"
            />
          </div>
        )}

        {keySecondary && (
          <PieChartTitle
            keyLabel={keyLabelSecondary}
            {...{ keySecondary, dateRanges, entityLabel }}
          />
        )}
        {keySecondary && (
          <div className="pie-chart-row">
            <PieChartSums entityType={'secondary'} period={'period1'} damageType={'injured'} />
            <PieChartSums entityType={'secondary'} period={'period2'} damageType={'injured'} />
          </div>
        )}
        {keySecondary && (
          <div className="pie-chart-row">
            <PieChartWrapper
              entityType={'secondary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              width={this.width}
              damageType="injured"
            />
            <PieChartWrapper
              entityType={'secondary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              width={this.width}
              damageType="injured"
            />
          </div>
        )}
        {keySecondary && (
          <div className="pie-chart-row">
            <PieChartSums entityType={'secondary'} period={'period1'} damageType={'killed'} />
            <PieChartSums entityType={'secondary'} period={'period2'} damageType={'killed'} />
          </div>
        )}
        {keySecondary && (
          <div className="pie-chart-row">
            <PieChartWrapper
              entityType={'secondary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              width={this.width}
              damageType="killed"
            />
            <PieChartWrapper
              entityType={'secondary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              width={this.width}
              damageType="killed"
            />
          </div>
        )}
      </div>
    );
  }
}

export default PieChartsContainer;
