import React from 'react';
import PropTypes from 'prop-types';

import SparkLineListController from './SparkLineListController';

const Sidebar = props => {
  const { entities, entityType } = props;
  return (
    <div className="Sidebar">
      <SparkLineListController {...{ entities, entityType }} />
    </div>
  );
};

Sidebar.propTypes = {
  // eslint-disable-next-line
  entities: PropTypes.arrayOf(PropTypes.object),
  entityType: PropTypes.string,
};

Sidebar.defaultProps = {
  entityType: '',
};

export default Sidebar;
