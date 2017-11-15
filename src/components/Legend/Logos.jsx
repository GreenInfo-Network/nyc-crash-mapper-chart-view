import React from 'react';

import CartoSvg from '../../../assets/logos/carto_negative.svg';
import GinPng from '../../../assets/logos/gin_logo.png';

const CartoLogo = props => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://carto.com"
    style={{ lineHeight: '1rem' }}
  >
    <CartoSvg {...props} />
  </a>
);

const GinLogo = props => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="http://greeninfo.org"
    style={{ lineHeight: '1rem' }}
  >
    <img alt="greeninfo-network logo" src={GinPng} {...props} />
  </a>
);

export default () => (
  <div className="Logos">
    <GinLogo style={{ display: 'inline-block' }} width="95px" height="48px" />
    <CartoLogo style={{ display: 'inline-block' }} width="62px" height="24px" />
  </div>
);
