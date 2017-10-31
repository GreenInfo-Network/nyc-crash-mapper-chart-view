import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';

import * as pt from '../common/reactPropTypeDefs';
import { setReferenceEntity, fetchEntityData } from '../actions';

const mapStateToProps = ({ entities, data }) => ({
  reference: entities.reference,
  boroughData: data.borough,
  citywideData: data.citywide,
});

/*
 * Class that creates the dropdown UI for the line chart reference (2nd y-axis) line
 * This class will cause an async request for borough data if a user changes the select value
 * from Citywide to something else, assuming borough data hasn't been fetched already
*/
class ReferenceEntitySelect extends Component {
  static propTypes = {
    boroughData: pt.data,
    citywideData: pt.data,
    reference: PropTypes.string.isRequired,
    setReferenceEntity: PropTypes.func.isRequired,
    fetchEntityData: PropTypes.func.isRequired,
  };

  static defaultProps = {
    boroughData: {},
    citywideData: {},
  };

  constructor() {
    super();
    this.handleChange = this.handleChange.bind(this);
  }

  componentDidMount() {
    const { reference, boroughData, citywideData } = this.props;

    // if the app loaded with a reference entity other than citywide make sure to fetch it
    if (reference !== 'citywide' && !boroughData.response) {
      this.props.fetchEntityData('borough');
    }

    // vice versa for above
    if (reference === 'citywide' && !citywideData.response) {
      this.props.fetchEntityData('citywide');
    }
  }

  componentWillReceiveProps(nextProps) {
    const { reference, boroughData, citywideData } = nextProps;

    // if user selected a borough, and we don't have borough data yet, make an async request for it
    if (reference !== 'citywide' && !boroughData.response) {
      this.props.fetchEntityData('borough');
    }

    // vice versa for above
    if (reference === 'citywide' && !citywideData.response) {
      this.props.fetchEntityData('citywide');
    }
  }

  handleChange(event) {
    this.props.setReferenceEntity(event.target.value);
  }

  render() {
    const { reference } = this.props;
    const options = [
      { value: 'citywide', label: 'Citywide' },
      { value: 'manhattan', label: 'Manhattan' },
      { value: 'bronx', label: 'The Bronx' },
      { value: 'brooklyn', label: 'Brooklyn' },
      { value: 'queens', label: 'Queens' },
      { value: 'staten island', label: 'Staten Island' },
    ];

    return (
      <div className="ReferenceEntitySelect">
        <p>Choose a reference geography:</p>
        <select value={reference} onChange={this.handleChange}>
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
  fetchEntityData,
})(ReferenceEntitySelect);
