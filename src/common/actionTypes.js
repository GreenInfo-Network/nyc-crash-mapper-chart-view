// set type of geographic entity
export const SET_ENTITY_TYPE = 'SET_ENTITY_TYPE';

// select crash filter types
export const FILTER_BY_TYPE_INJURY = 'FILTER_BY_TYPE_INJURY';
export const FILTER_BY_TYPE_FATALITY = 'FILTER_BY_TYPE_FATALITY';
export const FILTER_BY_NO_INJURY_FATALITY = 'FILTER_BY_NO_INJURY_FATALITY';

// select & deselect vehicle types
export const FILTER_BY_VEHICLE_CAR = 'FILTER_BY_VEHICLE_CAR';
export const FILTER_BY_VEHICLE_TRUCK = 'FILTER_BY_VEHICLE_TRUCK';
export const FILTER_BY_VEHICLE_MOTORCYCLE = 'FILTER_BY_VEHICLE_MOTORCYCLE';
export const FILTER_BY_VEHICLE_BICYCLE = 'FILTER_BY_VEHICLE_BICYCLE';
export const FILTER_BY_VEHICLE_SUV = 'FILTER_BY_VEHICLE_SUV';
export const FILTER_BY_VEHICLE_BUSVAN = 'FILTER_BY_VEHICLE_BUSVAN';
export const FILTER_BY_VEHICLE_SCOOTER = 'FILTER_BY_VEHICLE_SCOOTER';
export const FILTER_BY_VEHICLE_OTHER = 'FILTER_BY_VEHICLE_OTHER';

// select & deselect primary geo entity
export const SELECT_PRIMARY_ENTITY = 'SELECT_PRIMARY_ENTITY';
export const DESELECT_PRIMARY_ENTITY = 'DESELECT_PRIMARY_ENTITY';

// select & deselect secondary geo entity
export const SELECT_SECONDARY_ENTITY = 'SELECT_SECONDARY_ENTITY';
export const DESELECT_SECONDARY_ENTITY = 'DESELECT_SECONDARY_ENTITY';

// set / update first group's date range
export const SET_DATE_RANGE_GROUP_ONE = 'SET_DATE_RANGE_GROUP_ONE';

// set / update second group's date range
export const SET_DATE_RANGE_GROUP_TWO = 'SET_DATE_RANGE_GROUP_TWO';

// asynchronous actions, e.g. XHR
export const ENTITY_DATA_REQUEST = 'ENTITY_DATA_REQUEST';
export const ENTITY_DATA_SUCCESS = 'ENTITY_DATA_SUCCESS';
export const ENTITY_DATA_ERROR = 'ENTITY_DATA_ERROR';

// clear cached entites data
export const CLEAR_ENTITIES_DATA_CACHE = 'CLEAR_ENTITIES_DATA_CACHE';

// select the entity used for the line chart reference line
export const REFERENCE_ENTITY_SELECT = 'REFERENCE_ENTITY_SELECT';

// toggle chart view (trend, compare, rank)
export const CHART_VIEW_TOGGLE = 'CHART_VIEW_TOGGLE';
export const TREND_AGGREGATION_CHANGED = 'TREND_AGGREGATION_CHANGED';

// filtering and sorting geo entities
// currently applies only to list in sidebar and rank view
export const ENTITIES_SORT_NAME = 'ENTITIES_SORT_NAME';
export const ENTITIES_SORT_RANK = 'ENTITIES_SORT_RANK';
export const ENTITIES_FILTER_NAME = 'ENTITIES_FILTER_NAME';

// custom geography changes
export const CLEAR_CUSTOM_GEOGRAPHY = 'CLEAR_CUSTOM_GEOGRAPHY';
export const CHANGE_CUSTOM_GEOGRAPHY = 'CHANGE_CUSTOM_GEOGRAPHY';
