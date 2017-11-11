// formats the label for the geographic type
const entityTypeDisplay = entityType => {
  if (entityType === 'nypd_precinct') {
    return 'NYPD Precinct';
  }
  if (
    entityType !== 'neighborhood' &&
    entityType !== 'borough' &&
    entityType !== 'community_board'
  ) {
    return entityType.replace(/_/g, ' ');
  }
  return '';
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

  // left pad numbers so that they can be more easily used for text search
  if (id && typeof +id === 'number') {
    return +id < 10 ? `0${id}` : id.toString();
  }

  if (id) {
    return id.toString();
  }

  return id;
};

export default entityTypeDisplay;
