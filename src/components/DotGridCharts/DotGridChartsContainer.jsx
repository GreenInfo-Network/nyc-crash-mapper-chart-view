import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import { entityTypeDisplay, entityNameDisplay } from '../../common/labelFormatters';
import DotGridWrapper from '../../containers/DotGridWrapper';
import DotGridSums from '../../containers/DotGridSums';
import DotGridTitle from './DotGridTitle';
import DotGridPeriodsHeader from './DotGridPeriodsHeader';

/**
  * Class that houses the Dot Grid Wrapper components.
*/
class DotGridChartsContainer extends Component {
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

  constructor() {
    super();
    this.circleRadius = 5; // the size in pixels of each svg circle radius
    this.strokeWidth = 2; // width of circle svg element stroke
  }

  render() {
    const { entityType, keyPrimary, keySecondary, dateRanges } = this.props;
    const { customGeography } = this.props;
    const entityLabel = entityTypeDisplay(entityType);
    const keyLabelPrimary = entityNameDisplay(entityType, keyPrimary);
    const keyLabelSecondary = entityNameDisplay(entityType, keySecondary);

    return (
      <div className="DotGridChartsContainer scroll">
        <DotGridPeriodsHeader {...{ dateRanges }} />

        <DotGridTitle keyLabel={'Citywide'} {...{ dateRanges, keyPrimary: '', entityLabel: '' }} />
        <div className="dot-grid-row">
          <DotGridSums entityType={'citywide'} period={'period1'} />
          <DotGridSums entityType={'citywide'} period={'period2'} />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'citywide'}
            period={'period1'}
            title={'Period A'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
          <DotGridWrapper
            entityType={'citywide'}
            period={'period2'}
            title={'Period B'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'citywide'}
            period={'period1'}
            title={'Period A'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
          <DotGridWrapper
            entityType={'citywide'}
            period={'period2'}
            title={'Period B'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'citywide'}
            period={'period1'}
            title={'Period A'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
          <DotGridWrapper
            entityType={'citywide'}
            period={'period2'}
            title={'Period B'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
        </div>

        {customGeography.length ? (
          <DotGridTitle
            keyLabel={'Custom Geography'}
            {...{ dateRanges, keyPrimary: '', entityLabel: '' }}
          />
        ) : null}
        {customGeography.length ? (
          <div className="dot-grid-row">
            <DotGridSums entityType={'custom'} period={'period1'} />
            <DotGridSums entityType={'custom'} period={'period2'} />
          </div>
        ) : null}
        {customGeography.length ? (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
          </div>
        ) : null}
        {customGeography.length ? (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
          </div>
        ) : null}
        {customGeography.length ? (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
            <DotGridWrapper
              entityType={'custom'}
              customGeography={customGeography}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
          </div>
        ) : null}

        {keyPrimary && (
          <DotGridTitle keyLabel={keyLabelPrimary} {...{ keyPrimary, dateRanges, entityLabel }} />
        )}
        {keyPrimary && (
          <div className="dot-grid-row">
            <DotGridSums entityType={'primary'} period={'period1'} />
            <DotGridSums entityType={'primary'} period={'period2'} />
          </div>
        )}
        {keyPrimary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'primary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
            <DotGridWrapper
              entityType={'primary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
          </div>
        )}
        {keyPrimary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'primary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
            <DotGridWrapper
              entityType={'primary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
          </div>
        )}
        {keyPrimary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'primary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
            <DotGridWrapper
              entityType={'primary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
          </div>
        )}

        {keySecondary && (
          <DotGridTitle keyLabel={keyLabelSecondary} {...{ keyPrimary, dateRanges, entityLabel }} />
        )}
        {keySecondary && (
          <div className="dot-grid-row">
            <DotGridSums entityType={'secondary'} period={'period1'} />
            <DotGridSums entityType={'secondary'} period={'period2'} />
          </div>
        )}
        {keySecondary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'secondary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
            <DotGridWrapper
              entityType={'secondary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="pedestrian"
            />
          </div>
        )}
        {keySecondary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'secondary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
            <DotGridWrapper
              entityType={'secondary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="cyclist"
            />
          </div>
        )}
        {keySecondary && (
          <div className="dot-grid-row">
            <DotGridWrapper
              entityType={'secondary'}
              period={'period1'}
              title={'Period A'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
            <DotGridWrapper
              entityType={'secondary'}
              period={'period2'}
              title={'Period B'}
              radius={this.circleRadius}
              strokeWidth={this.strokeWidth}
              personType="motorist"
            />
          </div>
        )}

        {!keyPrimary && !keySecondary ? (
          <h5 className="select-entity">Select a {entityType.replace(/_/g, ' ')}</h5>
        ) : null}
      </div>
    );
  }
}

export default DotGridChartsContainer;
