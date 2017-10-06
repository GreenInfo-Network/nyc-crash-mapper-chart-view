// This module contains PropTypes definitions that are used by various components
// Defining them in a single place means that if we need to change them we can do so here,
// and not have to re-write them in every component that uses them!
import PropTypes from 'prop-types';

export const key = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);
export const date = PropTypes.instanceOf(Date);

export const entity = PropTypes.shape({
  color: PropTypes.string.isRequired,
  key,
  values: PropTypes.array,
});

// represents the filterType part of the Redux store
export const filterType = PropTypes.shape({
  fatality: PropTypes.shape({
    cyclist: PropTypes.bool.isRequired,
    motorist: PropTypes.bool.isRequired,
    pedestrian: PropTypes.bool.isRequired,
  }),
  injury: PropTypes.shape({
    cyclist: PropTypes.bool.isRequired,
    motorist: PropTypes.bool.isRequired,
    pedestrian: PropTypes.bool.isRequired,
  }),
  noInjuryFatality: PropTypes.bool.isRequired,
});

export const valuesByDateRange = PropTypes.shape({
  primary: PropTypes.shape({
    key,
    values: PropTypes.array,
  }),
  secondary: PropTypes.shape({
    key,
    values: PropTypes.array,
  }),
});

export const dateRange = PropTypes.shape({
  endDate: date,
  startDate: date,
});
