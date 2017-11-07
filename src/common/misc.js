const entityTypeDisplay = entityType =>
  entityType !== 'neighborhood' ? entityType.replace(/_/g, ' ') : '';

export default entityTypeDisplay;
