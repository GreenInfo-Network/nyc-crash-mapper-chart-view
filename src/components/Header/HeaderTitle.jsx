import React from 'react';
import ChekpedsJpg from '../../../assets/logos/checkpeds_logo@2x.jpg';

export default () => (
  <div className="HeaderTitle">
    <a href="http://chekpeds.com" target="_blank" rel="noopener noreferrer">
      <img className="chekpeds-logo" alt="Chekpeds Logo" src={ChekpedsJpg} />
    </a>
    <h3>nyc crash mapper</h3>
  </div>
);
