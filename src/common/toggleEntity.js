import {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
} from '../actions';

// Used by the Select Areas List Items & Rank Cards to toggle a primary or secondary entity
// @param {key} string or number: Unique identifier of the geographic entity
// @param {props} object: Props containing necessary data for determining how a entity should be toggled
const toggleEntity = (key, props) => {
  // When a user clicks a sparkline list item, pass that entity's data off to the redux store
  // so that it may be used by the charts.
  // Assumes the following are available in component's props:
  const { secondary, primary, response, entityType, dispatch } = props;
  const entity = {};
  entity.key = key;
  entity.values = response.filter(d => d[entityType] === key);

  if (!primary.key && key !== secondary.key) {
    dispatch(selectPrimaryEntity(entity));
  }

  if (primary.key && key === primary.key) {
    dispatch(deselectPrimaryEntity());
  }

  if (primary.key && !secondary.key && key !== primary.key) {
    dispatch(selectSecondaryEntity(entity));
  }

  if (secondary.key && key === secondary.key) {
    dispatch(deselectSecondaryEntity());
  }
};

export default toggleEntity;
