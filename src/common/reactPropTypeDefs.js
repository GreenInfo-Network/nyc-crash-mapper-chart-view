// This module contains PropTypes definitions that are shared between components
// Defining them in a single place means that if we need to change them we can do so here,
// and not have to re-write them in every component that uses them!
import PropTypes from 'prop-types';

// unique identifier / key for a given geography type
export const key = PropTypes.oneOfType([PropTypes.number, PropTypes.string]);

// just a JS date object
export const date = PropTypes.instanceOf(Date);

// a unique geographic entity which resides in store.entities.primary and store.entities.secondary
export const entity = PropTypes.shape({
  color: PropTypes.string.isRequired,
  key,
  values: PropTypes.arrayOf(PropTypes.object),
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

// represents object with unique key and filtered values for primary and secondary entities
export const valuesByDateRange = PropTypes.shape({
  primary: entity,
  secondary: entity,
});

// date range part of app state, start and end date objects
export const dateRange = PropTypes.shape({
  endDate: date,
  startDate: date,
});
