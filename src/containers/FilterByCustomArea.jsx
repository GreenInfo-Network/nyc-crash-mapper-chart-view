import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'query-string';

import { formatDateYM } from '../common/d3Utils';
import { coordinatelist } from '../common/reactPropTypeDefs';
import { clearCustomGeography } from '../actions/customGeographyActions';

class FilterByCustomArea extends Component {
  static propTypes = {
    customGeography: coordinatelist.isRequired,
    clearCustomGeography: PropTypes.func.isRequired,
  };

  clickClearButton() {
    this.props.clearCustomGeography();
  }

  render() {
    const queryParams = qs.stringify({
      ...this.props,
      clearCustomGeography: null,
      customGeography: null,
      geo: 'custom',
    });
    const hostname = process.env.NODE_ENV === 'production' ? 'crashmapper.org' : 'localhost:8080';
    const mainmapurl = `http://${hostname}/#/?${queryParams}`;

    // show the Draw button if there's no shape, or the Clear button if there is
    // avoids "draw? I already did?" and "clear what?" confusion on the part of the user
    const button1 = ! this.props.customGeography.length ? (
      <ul className="filter-list">
        <li><button className="med filter-options-button roboto-medium active"><a href={mainmapurl} className="active">draw area</a></button></li>
      </ul>
    ) : null;

    const button2 = this.props.customGeography.length ? (
      <ul className="filter-list">
        <li><button className="med filter-options-button roboto-medium" onClick={() => this.clickClearButton()}>clear area</button></li>
      </ul>
    ) : null;

    return (
      <div className="filter-by-type">
        {button1}
        {button2}
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { entities, dateRanges, filterType } = state;
  const { customGeography } = state;
  const { primary, entityType } = entities;
  const { period1 } = dateRanges;
  const { injury, fatality } = filterType;

  return {
    // used to link to the map app via query params
    geo: entityType,
    cinj: injury.cyclist,
    minj: injury.motorist,
    pinj: injury.pedestrian,
    cfat: fatality.cyclist,
    mfat: fatality.motorist,
    pfat: fatality.pedestrian,
    endDate: formatDateYM(period1.endDate), // only need the string representation here
    startDate: formatDateYM(period1.startDate), // only need the string representation here
    identifier: primary.key,
    // not for the map link
    customGeography,
  };
}

export default connect(mapStateToProps, {
  clearCustomGeography,
})(FilterByCustomArea);
