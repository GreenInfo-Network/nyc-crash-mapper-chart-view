import { connect } from 'react-redux';

import {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
} from '../actions';

import SparkLineList from '../components/SparkLineList';

const mapStateToProps = ({ entities, data }) => ({
  nested: data.nested,
  primary: entities.primary,
  secondary: entities.secondary,
});

export default connect(mapStateToProps, {
  selectPrimaryEntity,
  deselectPrimaryEntity,
  selectSecondaryEntity,
  deselectSecondaryEntity,
})(SparkLineList);
