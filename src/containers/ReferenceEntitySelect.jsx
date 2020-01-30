import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as pt from '../common/reactPropTypeDefs';
import { setReferenceEntity } from '../actions';
import { REFERENCE_ENTITY_NAMES } from '../common/labelFormatters';

const mapStateToProps = ({ entities, customGeography }) => ({
  reference: entities.reference,
  customGeography,
});

/*
 * Class that creates the dropdown UI for the line chart reference (2nd y-axis) line
 */
class ReferenceEntitySelect extends Component {
  static propTypes = {
    reference: PropTypes.string.isRequired,
    setReferenceEntity: PropTypes.func.isRequired,
    customGeography: pt.coordinatelist.isRequired,
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  handleChange(event) {
    this.props.setReferenceEntity(event.target.value);
  }

  render() {
    const { reference, customGeography } = this.props;
    const options = [
      { value: 'citywide', label: REFERENCE_ENTITY_NAMES.citywide },
      { value: 'manhattan', label: REFERENCE_ENTITY_NAMES.manhattan },
      { value: 'bronx', label: REFERENCE_ENTITY_NAMES.bronx },
      { value: 'brooklyn', label: REFERENCE_ENTITY_NAMES.brooklyn },
      { value: 'queens', label: REFERENCE_ENTITY_NAMES.queens },
      {
        value: 'staten island',
        label: REFERENCE_ENTITY_NAMES['staten island'],
      },
    ];
    if (customGeography.length) {
      options.push({ value: 'custom', label: REFERENCE_ENTITY_NAMES.custom });
    }

    return (
      <div className="ReferenceEntitySelect">
        <label htmlFor="reference-select">Benchmark or custom area</label>
        <select id="reference-select" value={reference} onChange={this.handleChange}>
          {options.map(o => (
            <option key={o.value} value={o.value}>
              {o.label}
            </option>
          ))}
        </select>
      </div>
    );
  }
}

export default connect(mapStateToProps, {
  setReferenceEntity,
})(ReferenceEntitySelect);
