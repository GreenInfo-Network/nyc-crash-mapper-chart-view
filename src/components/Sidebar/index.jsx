import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectAreasController from './SelectAreasController';
import OptionsContainer from './OptionsContainer';
import FilterByCustomArea from '../../containers/FilterByCustomArea';
import FilterByType from '../../containers/FilterByType';
import FilterByVehicle from '../../containers/FilterByVehicle';
import FilterByBoundary from '../../containers/FilterByBoundary';

class Sidebar extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterTerm: PropTypes.string,
    filterEntitiesByName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    filterTerm: '',
  };

  constructor() {
    super();
    this.state = {
      filterByTypeHeight: null,
      filterByVehicleHeight: null,
      filterByBoundaryHeight: null,
      filterByCustomAreaHeight: null,
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
    // but, those containers have headers at fixed heights which never close hence the two extra 43
    const { filterByTypeHeight } = this.state;
    const { filterByVehicleHeight } = this.state;
    const { filterByBoundaryHeight } = this.state;
    const { filterByCustomAreaHeight } = this.state;

    if (this.sidebar) {
      return (
        this.sidebar.offsetHeight -
        filterByTypeHeight -
        filterByVehicleHeight -
        filterByBoundaryHeight -
        filterByCustomAreaHeight -
        150
      );
    }
    return null;
  }

  render() {
    const { entityType, filterTerm, filterEntitiesByName } = this.props;
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
          title={'Filter By Crash Type'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByTypeHeight', height)}
        >
          <FilterByType />
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Filter By Vehicle Type Involved'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByVehicleHeight', height)}
        >
          <FilterByVehicle />
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Custom Area'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByCustomAreaHeight', height)}
        >
          <FilterByCustomArea />
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Filter By Boundary'}
          onMeasure={({ height }) => this.updateCollapsedHeight('filterByBoundaryHeight', height)}
        >
          <div className="FilterByBoundary">
            <FilterByBoundary entityType={entityType} />
          </div>
        </OptionsContainer>

        <hr />

        <OptionsContainer
          title={'Select Areas (Up to Two)'}
          collapsable={false}
          optionsContainerHeight={sparkLineListHeight}
          collapseHeight={sparkLineListHeight}
        >
          <SelectAreasController
            {...{ entityType, filterTerm, sparkLineListHeight, filterEntitiesByName }}
          />
        </OptionsContainer>
      </div>
    );
  }
}

export default Sidebar;
