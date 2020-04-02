import React from 'react';

import CartoSvg from '../../../assets/logos/carto_negative.svg';
import GinPng from '../../../assets/logos/gin_logo.png';
import LilyPng from '../../../assets/logos/lilynyc.png';

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

const LilyLogo = props => (
  <a
    target="_blank"
    rel="noopener noreferrer"
    href="https://lilynyc.org/"
    style={{ lineHeight: '1rem', marginRight: '18px' }}
  >
    <img alt="Lily Auchincloss Foundation logo" src={LilyPng} {...props} />
  </a>
);


export default () => (
  <div className="Logos">
    <LilyLogo style={{ display: 'inline-block' }} width="288px" height="30px" />
    <GinLogo style={{ display: 'inline-block' }} width="95px" height="48px" />
    <CartoLogo style={{ display: 'inline-block' }} width="62px" height="24px" />
  </div>
);
