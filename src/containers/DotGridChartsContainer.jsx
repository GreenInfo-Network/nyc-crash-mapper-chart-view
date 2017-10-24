import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as d3 from 'd3';

import * as pt from '../common/reactPropTypeDefs';
import DotGridWrapper from './DotGridWrapper';

const mapStateToProps = state => {
  const { browser, dateRanges, entities } = state;
  const { entityType } = entities;

  return {
    dateRanges,
    entityType,
    keyPrimary: entities.primary.key,
    keySecondary: entities.secondary.key,
    width: browser.width,
  };
};

/**
  * Class that houses the Dot Grid Wrapper components.
  * When the Wrapper Components group data via Redux, it will pass the data back here via setEntityPeriodValues
    The parent component stores the grouped data, and when it has grouped data for both time periods
    for a single entity, it will compute the sub heading heights for each person type so that they
    are vertically aligned for both time periods
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

    // Internal Component state for storing:
    // - the fixed y position of each subheading (ped, cyclist, motorist – depends on what is selected in crash filters)
    // - the grouped/nested data for each entity's time period
    this.state = {
      primary: {
        subheadHeights: null,
        period1: [],
        period2: [],
      },
      secondary: {
        subheadHeights: null,
        period1: [],
        period2: [],
      },
    };

    this.circleRadius = 5; // the size in pixels of each circle's radius
    this.chartsContainer = null; // to store react ref to component
    this.setEntityPeriodValues = this.setEntityPeriodValues.bind(this);
  }

  componentDidUpdate() {
    const { primary, secondary } = this.state;

    // if we have values for both primary time periods, we can now compute the sub heading heights for each person type
    if (primary.period1.length && primary.period2.length && !primary.subheadHeights) {
      this.setSubheadingHeights('primary');
    }

    // if we have values for both secondary time periods, we can now compute the sub heading heights for each person type
    if (secondary.period1.length && secondary.period2.length && !secondary.subheadHeights) {
      this.setSubheadingHeights('secondary');
    }
  }

  getContainerSize() {
    const cWidth = this.chartsContainer.clientWidth - 40 - 10; // account for padding & scrollbar
    const cHeight = this.chartsContainer.clientHeight - 40; // account for padding

    return {
      height: cHeight,
      width: cWidth,
    };
  }

  setEntityPeriodValues(values, period, entityType) {
    // Store the grouped dot grid data in component state
    // NOTE: using the async version of Component.setState here
    this.setState(prevState => ({
      ...prevState,
      [entityType]: {
        ...prevState[entityType],
        [period]: values,
      },
    }));
  }

  setSubheadingHeights(entityType) {
    // this method sets component state for an geo entity's subheadings y positions
    const { period1, period2 } = this.state[entityType];
    const yPositions = {};
    const len = period1.length;

    d3.range(len).forEach((d, i) => {
      const h1 = period1[i].gridHeight;
      const h2 = period2[i].gridHeight;
      const height = h1 > h2 ? h1 : h2;
      const personType = period1[i].key; // same for both periods
      yPositions[personType] = height + 20;
    });

    // store y positions for subheadings (ped, cyclist, motorist)
    // this will cause a re-render and pass the subheadHeights to the grid charts
    // NOTE: using the async version of Component.setState here
    this.setState(prevState => ({
      ...prevState,
      [entityType]: {
        ...prevState[entityType],
        subheadHeights: yPositions,
      },
    }));
  }

  render() {
    const { entityType, keyPrimary, keySecondary } = this.props;
    const { primary, secondary } = this.state;
    const entityLabel = entityType.replace(/_/, ' ');

    return (
      <div
        className="DotGridChartsContainer scroll"
        ref={_ => {
          this.chartsContainer = _;
        }}
      >
        {keyPrimary && <h5>{`${entityLabel} ${keyPrimary}`}</h5>}
        <div className="dot-grid-entity-one">
          <DotGridWrapper
            entityType={'primary'}
            period={'period2'}
            subheadHeights={primary.subheadHeights}
            title={'Period Two'}
            radius={this.circleRadius}
            setSubheadingHeights={this.setEntityPeriodValues}
          />
          <DotGridWrapper
            entityType={'primary'}
            period={'period1'}
            subheadHeights={primary.subheadHeights}
            title={'Period One'}
            radius={this.circleRadius}
            setSubheadingHeights={this.setEntityPeriodValues}
          />
        </div>
        {keySecondary && <h5>{`${entityLabel} ${keySecondary}`}</h5>}
        <div className="dot-grid-entity-two">
          <DotGridWrapper
            entityType={'secondary'}
            period={'period2'}
            subheadHeights={secondary.subheadHeights}
            title={'Period Two'}
            radius={this.circleRadius}
            setSubheadingHeights={this.setEntityPeriodValues}
          />
          <DotGridWrapper
            entityType={'secondary'}
            period={'period1'}
            subheadHeights={secondary.subheadHeights}
            title={'Period One'}
            radius={this.circleRadius}
            setSubheadingHeights={this.setEntityPeriodValues}
          />
        </div>
        {!keyPrimary && !keySecondary ? (
          <h5 className="select-entity">Select a {entityLabel}</h5>
        ) : null}
      </div>
    );
  }
}

export default connect(mapStateToProps, null)(DotGridChartsContainer);
