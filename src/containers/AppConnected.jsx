import { connect } from 'react-redux';

import * as actions from '../actions';
import App from '../components/App';

const mapStateToProps = state => ({
  width: state.browser.width,
  height: state.browser.height,
});

export default connect(mapStateToProps, {
  ...actions,
})(App);
