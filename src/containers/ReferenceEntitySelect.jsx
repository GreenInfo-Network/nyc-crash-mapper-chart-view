import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import { setReferenceEntity } from '../actions';

const mapStateToProps = ({ entities }) => ({ reference: entities.reference });

class ReferenceEntitySelect extends Component {
  static propTypes = {
    reference: PropTypes.string.isRequired,
    setReferenceEntity: PropTypes.func.isRequired,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setReferenceEntity(event.target.value);
  }

  render() {
    const { reference } = this.props;
    const options = [
      { value: 'citywide', label: 'Citywide' },
      { value: 1, label: 'Manhattan' },
      { value: 2, label: 'The Bronx' },
      { value: 3, label: 'Brooklyn' },
      { value: 4, label: 'Queens' },
      { value: 5, label: 'Staten Island' },
    ];

    return (
      <div className="ReferenceEntitySelect">
        <p>Choose a reference geography:</p>
        <select value={reference} onChange={this.handleChange}>
          {options.map(o => <option key={o.value}>{o.label}</option>)}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, { setReferenceEntity })(ReferenceEntitySelect);
