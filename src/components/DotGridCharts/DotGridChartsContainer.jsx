import React, { Component } from 'react';
import PropTypes from 'prop-types';

import * as pt from '../../common/reactPropTypeDefs';
import entityTypeDisplay, { entityIdDisplay } from '../../common/labelFormatters';
import DotGridWrapper from '../../containers/DotGridWrapper';
import DotGridTitle from './DotGridTitle';

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
    const entityLabel = entityTypeDisplay(entityType);
    const keyLabelPrimary = entityIdDisplay(entityType, keyPrimary);
    const keyLabelSecondary = entityIdDisplay(entityType, keySecondary);

    return (
      <div className="DotGridChartsContainer scroll">
        {keyPrimary && (
          <DotGridTitle keyLabel={keyLabelPrimary} {...{ keyPrimary, dateRanges, entityLabel }} />
        )}
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'primary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
          <DotGridWrapper
            entityType={'primary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'primary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
          <DotGridWrapper
            entityType={'primary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'primary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
          <DotGridWrapper
            entityType={'primary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
        </div>
        {keySecondary && (
          <DotGridTitle keyLabel={keyLabelSecondary} {...{ keyPrimary, dateRanges, entityLabel }} />
        )}
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'secondary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
          <DotGridWrapper
            entityType={'secondary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="pedestrian"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'secondary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
          <DotGridWrapper
            entityType={'secondary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="cyclist"
          />
        </div>
        <div className="dot-grid-row">
          <DotGridWrapper
            entityType={'secondary'}
            period={'period2'}
            title={'Period Two'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
          <DotGridWrapper
            entityType={'secondary'}
            period={'period1'}
            title={'Period One'}
            radius={this.circleRadius}
            strokeWidth={this.strokeWidth}
            personType="motorist"
          />
        </div>
        {!keyPrimary && !keySecondary ? (
          <h5 className="select-entity">Select a {entityType.replace(/_/g, ' ')}</h5>
        ) : null}
      </div>
    );
  }
}

export default DotGridChartsContainer;
