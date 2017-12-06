// the latLngs= parameter is a list of [ lng, lat ] arrays, forming a custom-drawn shape
// internally this becomes App state.customGeography
// a zero-length list (no custom shape) is entirely expected

import {
  CLEAR_CUSTOM_GEOGRAPHY,
  CHANGE_CUSTOM_GEOGRAPHY,
} from '../common/actionTypes';

const defaultState = [];

export default function(state = defaultState, action) {
  switch (action.type) {
    case CLEAR_CUSTOM_GEOGRAPHY:
      return [];  // replace our coordinatelist with an empty list
    case CHANGE_CUSTOM_GEOGRAPHY:
      return [];  // not really supported, placeholder
    default:
      return state;
  }
}
