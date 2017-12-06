import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'query-string';

import { formatDateYM } from '../common/d3Utils';

import { clearCustomGeography } from '../actions/';

class FilterByCustomArea extends Component {
  static propTypes = {
    clearCustomGeography: PropTypes.func.isRequired,
  };

  clickClearButton() {
    // eslint-disable-next-line
    console.log(this.props);
    this.props.clearCustomGeography();
  }

  render() {
    const queryParams = qs.stringify({ ...this.props, geo: 'custom' });
    const hostname = process.env.NODE_ENV === 'production' ? 'crashmapper.org' : 'localhost:8080';
    const mainmapurl = `http://${hostname}/#/?${queryParams}`;

    return (
      <div className="filter-by-type">
        <ul className="filter-list">
          <li><button className="med filter-options-button roboto-medium active"><a href={mainmapurl} className="active">draw area</a></button></li>
        </ul>
        <ul className="filter-list">
          <li><button className="med filter-options-button roboto-medium" onClick={() => this.clickClearButton()}>clear area</button></li>
        </ul>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { chartView, entities, dateRanges, filterType } = state;
  const { primary, entityType } = entities;
  const { period1 } = dateRanges;
  const { injury, fatality } = filterType;

  // everything here but `chartView` is used to link to the map app via query params
  return {
    chartView,
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
  };
}

export default connect(mapStateToProps, {
  clearCustomGeography,
})(FilterByCustomArea);
