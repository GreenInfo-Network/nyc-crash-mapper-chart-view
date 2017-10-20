import React from 'react';

const options = [
  { value: 'citywide', label: 'Citywide' },
  { value: 1, label: 'Manhattan' },
  { value: 2, label: 'The Bronx' },
  { value: 3, label: 'Brooklyn' },
  { value: 4, label: 'Queens' },
  { value: 5, label: 'Staten Island' },
];

export default () => (
  <select className="ReferenceEntitySelect" value="citywide">
    {options.map(o => <option key={o.value}>{o.label}</option>)}
  </select>
);
