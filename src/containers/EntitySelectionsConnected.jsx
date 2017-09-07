import { connect } from 'react-redux';

import { deselectPrimaryEntity, deselectSecondaryEntity } from '../actions';
import EntitySelections from '../components/EntitySelections';

const mapStateToProps = ({ entities }) => {
  const { primary, secondary } = entities;
  return {
    primary,
    secondary,
  };
};

export default connect(mapStateToProps, {
  deselectPrimaryEntity,
  deselectSecondaryEntity,
})(EntitySelections);
