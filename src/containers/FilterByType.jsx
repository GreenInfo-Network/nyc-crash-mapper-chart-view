import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterByTypeInjury, filterByTypeFatality, filterByNoInjFat } from '../actions/';
import * as pt from '../common/reactPropTypeDefs';

import FilterButton from '../components/FilterButton';

const mapStateToProps = ({ filterType }) => ({ filterType });

/**
 * Class that handles toggling crash filter types
 */
class FilterByType extends Component {
  static propTypes = {
    filterByTypeInjury: PropTypes.func.isRequired,
    filterByTypeFatality: PropTypes.func.isRequired,
    filterByNoInjFat: PropTypes.func.isRequired,
    filterType: pt.filterType.isRequired,
  };

  constructor() {
    super();
    this.handleInjuryFilter = this.handleInjuryFilter.bind(this);
    this.handleFatalityFilter = this.handleFatalityFilter.bind(this);
  }

  handleInjuryFilter(id) {
    // eslint-disable-next-line
    const { filterByTypeInjury } = this.props;
    filterByTypeInjury(id);
  }

  handleFatalityFilter(id) {
    // eslint-disable-next-line
    const { filterByTypeFatality } = this.props;
    filterByTypeFatality(id);
  }

  render() {
    const {
      filterType,
      // eslint-disable-next-line
      filterByTypeFatality,
      // eslint-disable-next-line
      filterByTypeInjury,
      // eslint-disable-next-line
      filterByNoInjFat,
    } = this.props;

    const { injury, fatality } = filterType;

    return (
      <div className="filter-by-type">
        <ul className="filter-list">
          <li>
            <FilterButton
              label={'cyclist fatality'}
              id={'cyclist'}
              handleClick={this.handleFatalityFilter}
              btnSize={'med'}
              isActive={fatality.cyclist}
            />
          </li>
          <li>
            <FilterButton
              label={'motorist fatality'}
              id={'motorist'}
              handleClick={this.handleFatalityFilter}
              btnSize={'med'}
              isActive={fatality.motorist}
            />
          </li>
          <li>
            <FilterButton
              label={'pedestrian fatality'}
              id={'pedestrian'}
              handleClick={this.handleFatalityFilter}
              btnSize={'med'}
              isActive={fatality.pedestrian}
            />
          </li>
        </ul>
        <ul className="filter-list">
          <li>
            <FilterButton
              label={'cyclist injury'}
              id={'cyclist'}
              handleClick={this.handleInjuryFilter}
              btnSize={'med'}
              isActive={injury.cyclist}
            />
          </li>
          <li>
            <FilterButton
              label={'motorist injury'}
              id={'motorist'}
              handleClick={this.handleInjuryFilter}
              btnSize={'med'}
              isActive={injury.motorist}
            />
          </li>
          <li>
            <FilterButton
              label={'pedestrian injury'}
              id={'pedestrian'}
              handleClick={this.handleInjuryFilter}
              btnSize={'med'}
              isActive={injury.pedestrian}
            />
          </li>
        </ul>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  filterByTypeFatality,
  filterByTypeInjury,
  filterByNoInjFat,
})(FilterByType);
