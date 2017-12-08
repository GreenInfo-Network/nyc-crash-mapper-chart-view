import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import qs from 'query-string';

import { formatDateYM } from '../common/d3Utils';
import * as pt from '../common/reactPropTypeDefs';
import { clearCustomGeography } from '../actions/customGeographyActions';
import { setReferenceEntity } from '../actions';

class FilterByCustomArea extends Component {
  static propTypes = {
    customGeography: pt.coordinatelist.isRequired,
    clearCustomGeography: PropTypes.func.isRequired,
    setReferenceEntity: PropTypes.func.isRequired,
    // used to link to the map app via query params; see also the qs.stringify() call on queryParams
    endDate: PropTypes.string.isRequired,
    startDate: PropTypes.string.isRequired,
  };

  static defaultProps = {
    // used to link to the map app via query params
    geo: null,
    identifier: null,
  };

  clickClearButton() {
    this.props.clearCustomGeography();
    this.props.setReferenceEntity('citywide');
  }

  render() {
    // used to link to the map app via query params; see also propTypes and mapStateToProps
    const queryParams = qs.stringify({
      endDate: this.props.endDate,
      startDate: this.props.startDate,
      geo: 'custom',
    });
    const hostname = process.env.NODE_ENV === 'production' ? 'crashmapper.org' : 'localhost:8080';
    const mainmapurl = `http://${hostname}/#/?${queryParams}`;

    // show the Draw button if there's no shape, or the Clear button if there is
    // avoids "draw? I already did?" and "clear what?" confusion on the part of the user
    const button1 = !this.props.customGeography.length ? (
      <ul className="filter-list">
        <li>
          <button className="med filter-options-button roboto-medium active">
            <a href={mainmapurl} className="active">
              draw area
            </a>
          </button>
        </li>
      </ul>
    ) : null;

    const button2 = this.props.customGeography.length ? (
      <ul className="filter-list">
        <li>
          <button
            className="med filter-options-button roboto-medium"
            onClick={() => this.clickClearButton()}
          >
            clear area
          </button>
        </li>
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
  const { customGeography } = state;
  const { dateRanges } = state;
  const { period1 } = dateRanges;

  return {
    // used to link to the map app via query params; see also the qs.stringify() call on queryParams
    endDate: formatDateYM(period1.endDate),
    startDate: formatDateYM(period1.startDate),
    // not for the map link
    customGeography,
  };
}

export default connect(mapStateToProps, {
  clearCustomGeography,
  setReferenceEntity,
})(FilterByCustomArea);
