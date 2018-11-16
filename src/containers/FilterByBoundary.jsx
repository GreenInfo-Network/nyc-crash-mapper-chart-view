import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setEntityType } from '../actions';

class FilterByBoundary extends Component {
  static propTypes = {
    entityType: PropTypes.string.isRequired,
    setEntityType: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    const { entityType } = props;
    this.state = { value: entityType };
    this.handleChange = this.handleChange.bind(this);
  }

  shouldComponentUpdate(nextProps) {
    if (nextProps.entityType !== this.props.entityType) {
      return true;
    }

    return false;
  }

  handleChange(event) {
    this.props.setEntityType(event.target.value);
  }

  render() {
    const { entityType } = this.props;

    const values = [
      { value: 'borough', label: 'Borough' },
      { value: 'community_board', label: 'Community Board' },
      { value: 'city_council', label: 'City Council' },
      { value: 'assembly', label: 'Assembly District' },
      { value: 'senate', label: 'Senate District' },
      { value: 'neighborhood', label: 'Neighborhood (NTA)' },
      { value: 'nypd_precinct', label: 'NYPD Precinct' },
      { value: 'intersection', label: 'Intersection' },
    ];

    return (
      <select value={entityType} onChange={this.handleChange}>
        {values.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }
}

const mapStateToProps = ({ entities }) => {
  const { entityType } = entities;
  return { entityType };
};

export default connect(mapStateToProps, { setEntityType })(FilterByBoundary);
