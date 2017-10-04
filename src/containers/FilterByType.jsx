import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { filterByTypeInjury, filterByTypeFatality, filterByNoInjFat } from '../actions/';

import FilterButton from '../components/FilterButton';

const mapStateToProps = ({ filterType }) => {
  const { injury, fatality, noInjuryFatality } = filterType;
  return {
    injury,
    fatality,
    noInjuryFatality,
  };
};

class FilterByType extends Component {
  render() {
    const {
      // eslint-disable-next-line
      filterByTypeFatality,
      // eslint-disable-next-line
      filterByTypeInjury,
      // eslint-disable-next-line
      filterByNoInjFat,
      injury,
      fatality,
    } = this.props;

    return (
      <div className="filter-by-type">
        <ul className="filter-list">
          <li>
            <FilterButton
              label={'cyclist fatality'}
              id={'cyclist'}
              handleClick={filterByTypeFatality}
              btnSize={'med'}
              isActive={fatality.cyclist}
            />
          </li>
          <li>
            <FilterButton
              label={'motorist fatality'}
              id={'motorist'}
              handleClick={filterByTypeFatality}
              btnSize={'med'}
              isActive={fatality.motorist}
            />
          </li>
          <li>
            <FilterButton
              label={'pedestrian fatality'}
              id={'pedestrian'}
              handleClick={filterByTypeFatality}
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
              handleClick={filterByTypeInjury}
              btnSize={'med'}
              isActive={injury.cyclist}
            />
          </li>
          <li>
            <FilterButton
              label={'motorist injury'}
              id={'motorist'}
              handleClick={filterByTypeInjury}
              btnSize={'med'}
              isActive={injury.motorist}
            />
          </li>
          <li>
            <FilterButton
              label={'pedestrian injury'}
              id={'pedestrian'}
              handleClick={filterByTypeInjury}
              btnSize={'med'}
              isActive={injury.pedestrian}
            />
          </li>
        </ul>
      </div>
    );
  }
}

FilterByType.propTypes = {
  filterByTypeInjury: PropTypes.func.isRequired,
  filterByTypeFatality: PropTypes.func.isRequired,
  filterByNoInjFat: PropTypes.func.isRequired,
  fatality: PropTypes.shape({
    cyclist: PropTypes.bool.isRequired,
    motorist: PropTypes.bool.isRequired,
    pedestrian: PropTypes.bool.isRequired,
  }).isRequired,
  injury: PropTypes.shape({
    cyclist: PropTypes.bool.isRequired,
    motorist: PropTypes.bool.isRequired,
    pedestrian: PropTypes.bool.isRequired,
  }).isRequired,
  noInjuryFatality: PropTypes.bool.isRequired,
};

export default connect(mapStateToProps, {
  filterByTypeFatality,
  filterByTypeInjury,
  filterByNoInjFat,
})(FilterByType);
