import { connect } from 'react-redux';

import { deselectPrimaryEntity, deselectSecondaryEntity } from '../actions';

import Legend from '../components/Legend/';

const mapStateToProps = state => {
  const { filterType, chartView, entities } = state;
  return {
    entities,
    filterType,
    chartView,
  };
};

export default connect(mapStateToProps, { deselectPrimaryEntity, deselectSecondaryEntity })(Legend);
