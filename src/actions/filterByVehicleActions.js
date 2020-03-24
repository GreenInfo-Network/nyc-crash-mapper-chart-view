import {
  FILTER_BY_VEHICLE_CAR,
  FILTER_BY_VEHICLE_TRUCK,
  FILTER_BY_VEHICLE_MOTORCYCLE,
  FILTER_BY_VEHICLE_BICYCLE,
  FILTER_BY_VEHICLE_SUV,
  FILTER_BY_VEHICLE_BUSVAN,
  FILTER_BY_VEHICLE_SCOOTER,
  FILTER_BY_VEHICLE_OTHER,
} from '../common/actionTypes';

export const filterByVehicleCar = () => ({
  type: FILTER_BY_VEHICLE_CAR,
});

export const filterByVehicleTruck = () => ({
  type: FILTER_BY_VEHICLE_TRUCK,
});

export const filterByVehicleMotorcycle = () => ({
  type: FILTER_BY_VEHICLE_MOTORCYCLE,
});

export const filterByVehicleBicycle = () => ({
  type: FILTER_BY_VEHICLE_BICYCLE,
});

export const filterByVehicleSuv = () => ({
  type: FILTER_BY_VEHICLE_SUV,
});

export const filterByVehicleBusVan = () => ({
  type: FILTER_BY_VEHICLE_BUSVAN,
});

export const filterByVehicleScooter = () => ({
  type: FILTER_BY_VEHICLE_SCOOTER,
});

export const filterByVehicleOther = () => ({
  type: FILTER_BY_VEHICLE_OTHER,
});

export const filterByVehicle = type => {
  switch (type) {
    case 'car':
      return filterByVehicleCar();
    case 'truck':
      return filterByVehicleTruck();
    case 'motorcycle':
      return filterByVehicleMotorcycle();
    case 'bicycle':
      return filterByVehicleBicycle();
    case 'suv':
      return filterByVehicleSuv();
    case 'busvan':
      return filterByVehicleBusVan();
    case 'scooter':
      return filterByVehicleScooter();
    case 'other':
      return filterByVehicleOther();
    default:
      throw new Error('filterByVehicle() unknown vehicle action');
  }
};
