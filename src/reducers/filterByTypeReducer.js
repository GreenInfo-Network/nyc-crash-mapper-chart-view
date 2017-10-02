import {
  FILTER_BY_TYPE_INJURY,
  FILTER_BY_TYPE_FATALITY,
  FILTER_BY_NO_INJURY_FATALITY,
} from '../common/actionTypes';

const defaultState = {
  injury: {
    cyclist: true,
    motorist: true,
    pedestrian: true,
  },
  fatality: {
    cyclist: false,
    motorist: false,
    pedestrian: false,
  },
  noInjuryFatality: false,
};

export default (state = defaultState, action) => {
  const { personType } = action;
  const { injury, fatality } = state;

  switch (action.type) {
    case FILTER_BY_TYPE_INJURY:
      return {
        ...state,
        injury: {
          ...injury,
          [personType]: !injury[personType],
        },
        noInjuryFatality: false,
      };
    case FILTER_BY_TYPE_FATALITY:
      return {
        ...state,
        fatality: {
          ...fatality,
          [personType]: !fatality[personType],
        },
        noInjuryFatality: false,
      };
    case FILTER_BY_NO_INJURY_FATALITY:
      return {
        ...defaultState,
        noInjuryFatality: !state.noInjuryFatality,
      };
    default:
      return state;
  }
};
