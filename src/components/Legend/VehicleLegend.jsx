import React from 'react';

export default () => {
  const vehicles = ['car', 'suv', 'truck', 'bus', 'motor', 'e-bike', 'bike'];
  const colors = ['#349093', '#51787C', '#4A94CA', '#7CC5DB', '#89CCBC', '#69B883', '#A1CA5D'];

  return (
    <div className="VehicleLegend">
      {vehicles.map((vehicle, i) => (
        <div className="vehicle-icon" key={i} style={{ background: colors[i] }}>
          <img src={`../../../assets/icons/${vehicle}.svg`} alt="vehicle" />
        </div>
      ))}
      <div className="vehicle-icon other-icon">
        <span>Other</span>
      </div>
    </div>
  );
};
