import { connect } from 'react-redux';

import LineChartsContainer from '../components/LineChartsContainer';

const mapStateToProps = ({ data, entities }) => ({
  nested: data.nested,
  primary: entities.primary,
  secondary: entities.secondary,
});

export default connect(mapStateToProps, null)(LineChartsContainer);
