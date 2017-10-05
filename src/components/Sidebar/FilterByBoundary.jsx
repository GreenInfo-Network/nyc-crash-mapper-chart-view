import React, { Component } from 'react';
import PropTypes from 'prop-types';

class FilterByBoundary extends Component {
  static propTypes = {
    entityType: PropTypes.string.isRequired,
  };

  constructor(props) {
    super(props);
    const { entityType } = props;
    this.state = { value: entityType };
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.setState({
      value: event.target.value,
    });
  }

  render() {
    const { value } = this.state;

    const values = [
      { value: 'borough', label: 'Borough' },
      { value: 'community_board', label: 'Community Board' },
      { value: 'city_council', label: 'City Council' },
      { value: 'neighborhood', label: 'Neighborhood (NTA)' },
      { value: 'nypd_precinct', label: 'NYPD Precinct' },
    ];

    return (
      <select value={value} onChange={this.handleChange}>
        {values.map(item => (
          <option key={item.value} value={item.value}>
            {item.label}
          </option>
        ))}
      </select>
    );
  }
}

export default FilterByBoundary;
