import React from 'react';
import PropTypes from 'prop-types';
import * as pt from '../../common/reactPropTypeDefs';

// Renders the nav menu items in the header
const Menu = props => {
  const { chartView, toggleChartView } = props;
  const items = [
    { type: 'link', value: 'http://crashmapper.org', label: 'Map' },
    { type: 'view', value: 'trend', label: 'Trend' },
    { type: 'view', value: 'compare', label: 'Compare' },
    { type: 'view', value: 'rank', label: 'Rank' },
    { type: 'meta', value: 'about', label: 'About' },
  ];

  const handleViewClick = value => {
    // prevent unnecessary action creator from being triggered
    if (value !== chartView) {
      toggleChartView(value);
    }
  };

  const mapTypeToElement = item => {
    const { type } = item;
    const className = chartView === item.value ? 'active' : null;

    switch (type) {
      case 'link':
        return (
          <a target="_blank" rel="noopener noreferrer" href={item.value} className={className}>
            {item.label}
          </a>
        );

      case 'view':
        return (
          <button className={className} onClick={() => handleViewClick(item.value)}>
            {item.label}
          </button>
        );

      // TO DO: implement "About"
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
};

export default Menu;
