import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterByVehicle } from '../actions/';
import * as pt from '../common/reactPropTypeDefs';

import FilterButton from '../components/FilterButton';

const mapStateToProps = ({ filterVehicle }) => ({ filterVehicle });

/**
 * Class that handles toggling crash filter types
 */
class FilterByVehicle extends Component {
  static propTypes = {
    filterByVehicle: PropTypes.func.isRequired,
    filterVehicle: pt.filterVehicle.isRequired,
  };

  constructor() {
    super();
    this.toggleVehicleFilter = this.toggleVehicleFilter.bind(this);
  }

  toggleVehicleFilter(vehtype) {
    this.props.filterByVehicle(vehtype);
  }

  render() {
    const { filterVehicle } = this.props;
    const { vehicle } = filterVehicle;

    return (
      <div className="filter-by-type">
        <ul className="filter-list">
          <li>
            <FilterButton
              label={'car'}
              id={'car'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.car}
            />
          </li>
          <li>
            <FilterButton
              label={'truck'}
              id={'truck'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.truck}
            />
          </li>
          <li>
            <FilterButton
              label={'motorcycle-moped'}
              id={'motorcycle'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.motorcycle}
            />
          </li>
          <li>
            <FilterButton
              label={'bicycle'}
              id={'bicycle'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.bicycle}
            />
          </li>
        </ul>
        <ul className="filter-list">
          <li>
            <FilterButton
              label={'suv'}
              id={'suv'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.suv}
            />
          </li>
          <li>
            <FilterButton
              label={'bus-van'}
              id={'busvan'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.busvan}
            />
          </li>
          <li>
            <FilterButton
              label={'e-bike-scooter'}
              id={'scooter'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.scooter}
            />
          </li>
          <li>
            <FilterButton
              label={'other'}
              id={'other'}
              handleClick={this.toggleVehicleFilter}
              btnSize={'med'}
              isActive={vehicle.other}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  filterByVehicle,
})(FilterByVehicle);
