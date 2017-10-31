import React from 'react';
import PropTypes from 'prop-types';
import * as pt from '../../common/reactPropTypeDefs';

const items = [
  { type: 'link', value: 'http://crashmapper.org', label: 'Map' },
  { type: 'view', value: 'trend', label: 'Trend' },
  { type: 'view', value: 'compare', label: 'Compare' },
  { type: 'view', value: 'rank', label: 'Rank' },
  { type: 'meta', value: 'about', label: 'About' },
];

const Menu = props => {
  const { chartView, toggleChartView } = props;

  const mapTypeToElement = item => {
    const { type } = item;
    switch (type) {
      case 'link':
        return (
          <a target="_blank" rel="noopener noreferrer" href={item.value}>
            {item.label}
          </a>
        );

      case 'view':
        return <button onClick={() => toggleChartView(item.value)}>{item.label}</button>;

      // TO DO: implement "About"
      default:
        return <button onClick={() => {}}>{item.label}</button>;
    }
  };

  return (
    <ul className="Menu">
      {items.map(item => (
        <li key={item.label} className={chartView === item.value ? 'active' : null}>
          {mapTypeToElement(item)}
        </li>
      ))}
    </ul>
  );
};

Menu.propTypes = {
  toggleChartView: PropTypes.func.isRequired,
  chartView: pt.chartView.isRequired,
};

export default Menu;
