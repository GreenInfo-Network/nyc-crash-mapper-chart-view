import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SparkLineListController from './SparkLineListController';
import OptionsContainer from './OptionsContainer';
import FilterByType from '../../containers/FilterByType';

class Sidebar extends Component {
  static propTypes = {
    entityType: PropTypes.string,
  };

  static defaultProps = {
    entityType: '',
  };

  constructor() {
    super();
    this.state = {
      filterByTypeHeight: null,
      filterByTypeOpened: true,
      filterByBoundaryHeight: null,
      filterByBoundaryOpened: true,
    };

    // ref to component's self
    this.sidebar = null;
    // ref to sparkline list component
    this.sparklineList = null;

    // callbacks to pass to collapsable components to obtain their heights
    this.updateCollapsedHeight = this.updateCollapsedHeight.bind(this);
    this.onMeasure = this.onMeasure.bind(this);
  }

  // eslint-disable-next-line
  onMeasure({ height, width }) {
    // eslint-disable-next-line
    return height;
  }

  updateCollapsedHeight(name, height) {
    // height of collapsable component changed, invoke a re-render
    this.setState({
      [name]: height,
    });
  }

  computeSparkLineListHeight() {
    // the sparkline list & controller take up remaining sidebar height not used by the collapsable containers
    // as such its height needs to be calculated any time the 2 collapsable containers open/close
    // but, those containers have headers at fixed heights which never close and 10px of padding-bottom
    // hence the two extra 54
    const { filterByTypeHeight, filterByBoundaryHeight } = this.state;

    if (this.sidebar) {
      return this.sidebar.offsetHeight - filterByTypeHeight - filterByBoundaryHeight - 33 - 54 - 54;
    }
    return null;
  }

  render() {
    const { entityType } = this.props;
    const sparkLineListHeight = this.computeSparkLineListHeight();

    return (
      <div
        className="Sidebar"
        ref={_ => {
          this.sidebar = _;
        }}
      >
        <div>
          <h6 style={{ textTransform: 'uppercase', fontWeight: 500 }}>Chart Options</h6>
        </div>

        <hr />

        <OptionsContainer
          title={'Filter By Type'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByTypeHeight', height)}
        >
          <FilterByType />
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Filter By Boundary'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByBoundaryHeight', height)}
        >
          <div className="FilterByBoundary">
            <p>TO DO...</p>
          </div>
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Select Areas'}
          collapsable={false}
          optionsContainerHeight={sparkLineListHeight}
          collapseHeight={sparkLineListHeight}
        >
          <SparkLineListController {...{ entityType, sparkLineListHeight }} />
        </OptionsContainer>
      </div>
    );
  }
}

export default Sidebar;
