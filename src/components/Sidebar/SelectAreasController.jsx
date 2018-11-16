import React, { Component } from 'react';
import PropTypes from 'prop-types';

import SelectAreasList from '../../containers/SelectAreasList';

/** Class that houses the SelectAreasList and provides a UI & Controlled Form for filtering it
*/
class SelectAreasController extends Component {
  static propTypes = {
    entityType: PropTypes.string,
    filterTerm: PropTypes.string,
    sparkLineListHeight: PropTypes.number,
    filterEntitiesByName: PropTypes.func.isRequired,
  };

  static defaultProps = {
    entityType: '',
    filterTerm: '',
    sparkLineListHeight: null,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.filterEntitiesByName(event.target.value);
  }

  render() {
    const { entityType, filterTerm, sparkLineListHeight } = this.props;

    let searchtitle = entityType.replace(/_/, ' ');
    switch (entityType) {
      case 'assembly':
      case 'senate':
        searchtitle += ' districts';
        break;
      default:
        searchtitle += 's';
        break;
    }

    return (
      <div className="SelectAreasController">
        <div className="select-areas-controls">
          <input
            placeholder={`Search ${searchtitle}`}
            value={filterTerm}
            onChange={this.handleChange}
            type="text"
          />
        </div>
        <SelectAreasList {...{ sparkLineListHeight }} />
      </div>
    );
  }
}

export default SelectAreasController;
