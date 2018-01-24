import * as lodashString from 'lodash/string';

// formats the label for the geographic type
export const entityTypeDisplay = (entityType, prettycase) => {
  const typename = entityType.replace(/_/g, ' ');
  const giveback = prettycase ? lodashString.startCase(lodashString.camelCase(typename)) : typename;

  switch (entityType) {
    case 'nypd_precinct':
      return 'NYPD Precinct';
    default:
      return giveback;
  }
};

// formats the label for the entity key/id
export const entityIdDisplay = (entityType, id) => {
  // replace first digit with corresponding borough name
  if (id && entityType === 'community_board') {
    const split = id.toString().split('');
    const number = split.slice(1).join('');
    const boroughs = [undefined, 'Manhattan', 'Bronx', 'Brooklyn', 'Queens', 'Staten Island'];
    return `${boroughs[+split[0]]} ${number}`;
  }

  // intersections are weird, and have name|id concatenated so we can have unique IDs with non-unique names
  // see also sqlQueries.js sqlIntersection()
  if (id && entityType === 'intersection') {
    return id.split('|')[1];
  }

  // left pad numbers so that they can be more easily used for text search
  if (id && typeof +id === 'number') {
    return +id < 10 ? `0${id}` : id.toString();
  }

  if (id) {
    return id.toString();
  }

  return id;
};

export const entityNameDisplay = (entityType, id) => {
  // this separation of ID and Label was specific to intersection types
  if (id && entityType === 'intersection') {
    return id.split('|')[0];
  }

  // most other cases just return "Area Type ID"
  return `${entityTypeDisplay(entityType, true)} ${id}`;
};

export const REFERENCE_ENTITY_NAMES = {
  citywide: 'Citywide',
  custom: 'Custom Geography',
  manhattan: 'Manhattan',
  bronx: 'The Bronx',
  brooklyn: 'Brooklyn',
  queens: 'Queens',
  'staten island': 'Staten Island',
};

export default entityTypeDisplay;
