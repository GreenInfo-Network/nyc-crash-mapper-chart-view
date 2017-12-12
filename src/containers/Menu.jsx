import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import qs from 'query-string';

import { formatDateYM } from '../common/d3Utils';
import * as pt from '../common/reactPropTypeDefs';
import { toggleChartView } from '../actions';

function mapStateToProps(state) {
  const { chartView, entities, dateRanges, filterType } = state;
  const { customGeography } = state;
  const { primary, entityType } = entities;
  const { period1 } = dateRanges;
  const { injury, fatality } = filterType;

  // everything here but `chartView` is used to link to the map app via query params
  return {
    chartView,
    geo: entityType,
    customGeography,
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

// Renders the nav menu items in the header
const Menu = props => {
  // eslint-disable-next-line
  const { chartView, toggleChartView, ...rest } = props;
  const { customGeography } = props;

  const params = {
    cinj: props.cinj,
    minj: props.minj,
    pinj: props.pinj,
    cfat: props.cfat,
    mfat: props.mfat,
    pfat: props.pfat,
    endDate: props.endDate,
    startDate: props.startDate,
  };
  if (customGeography.length) {
    params.geo = 'custom';
    params.lngLats = encodeURIComponent(JSON.stringify(customGeography));
  } else {
    params.geo = props.geo;
    params.identifier = props.identifier;
    params.zoom = 11;
    params.lat = 40.7048;
    params.lng = -73.8967;
  }

  const queryParams = qs.stringify(params);
  const hostname = process.env.NODE_ENV === 'production' ? 'crashmapper.org' : 'localhost:8080';

  const items = [
    { type: 'link', value: `http://${hostname}/#/?${queryParams}`, label: 'Map' },
    { type: 'view', value: 'trend', label: 'Trend' },
    { type: 'view', value: 'compare', label: 'Compare' },
    { type: 'view', value: 'rank', label: 'Rank' },
    { type: 'view', value: 'about', label: 'About' },
  ];

  const handleViewClick = value => {
    // prevent action creator from being triggered unnecessary
    if (value !== chartView) {
      props.toggleChartView(value);
    }
  };

  const mapTypeToElement = item => {
    const { type } = item;
    const className = chartView === item.value ? 'active' : null;

    switch (type) {
      case 'link':
        return (
          <a href={item.value} className={className}>
            {item.label}
          </a>
        );

      case 'view':
      case 'about':
        return (
          <button className={className} onClick={() => handleViewClick(item.value)}>
            {item.label}
          </button>
        );

      default:
        return <button onClick={() => {}}>{item.label}</button>;
    }
  };

  return (
    <ul className="Menu">
      {items.map(item => <li key={item.label}>{mapTypeToElement(item)}</li>)}
    </ul>
  );
};

Menu.propTypes = {
  toggleChartView: PropTypes.func.isRequired,
  chartView: pt.chartView.isRequired,
  geo: PropTypes.string,
  customGeography: pt.coordinatelist.isRequired,
  cinj: PropTypes.bool.isRequired,
  minj: PropTypes.bool.isRequired,
  pinj: PropTypes.bool.isRequired,
  cfat: PropTypes.bool.isRequired,
  mfat: PropTypes.bool.isRequired,
  pfat: PropTypes.bool.isRequired,
  endDate: PropTypes.string.isRequired,
  startDate: PropTypes.string.isRequired,
  identifier: pt.key,
};

Menu.defaultProps = {
  geo: '',
  identifier: '',
};

export default connect(mapStateToProps, { toggleChartView })(Menu);
