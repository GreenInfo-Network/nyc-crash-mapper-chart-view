import { connect } from 'react-redux';

import { deselectPrimaryEntity, deselectSecondaryEntity } from '../actions';

import Legend from '../components/Legend/';

const mapStateToProps = state => {
  const { filterType, trendCompare, entities } = state;
  return {
    entities,
    filterType,
    trendCompare,
  };
};

export default connect(mapStateToProps, { deselectPrimaryEntity, deselectSecondaryEntity })(Legend);
