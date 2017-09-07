import { connect } from 'react-redux';

import * as actions from '../actions';
import App from '../components/App';

const mapStateToProps = ({ browser, data, entities }) => ({
  width: browser.width,
  height: browser.height,
  entityData: data.response,
  entitiesNested: data.nested,
  entityType: entities.entityType,
});

export default connect(mapStateToProps, {
  ...actions,
})(App);
