import React from 'react';
import PropTypes from 'prop-types';
import SvgFile from '../../assets/icons/loading.svg';

// turn our SVG file into a React Component so that we can use CSS overrides
const SvgSpinner = props => <SvgFile {...props} />;

// Simple component that can display an arbitray message to the user
// optionally may display an SVG spinner, useful for informing user of async tasks
const Message = ({ message, showSpinner }) => (
  <div className="Message">
    {showSpinner && <SvgSpinner className="SvgSpinner" width="25" height="25" />}
    <h5>{message}</h5>
  </div>
);

Message.propTypes = {
  showSpinner: PropTypes.bool,
  message: PropTypes.string.isRequired,
};

Message.defaultProps = {
  showSpinner: false,
};

export default Message;
