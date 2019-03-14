export const fetchQueryString = state => {
  const query = {
    language: state.language
  };

  if ( state.term ) {
    query.term = state.term;
    query.sortBy = 'relevance';
  } else {
    query.sortBy = 'published';
  }

  if ( state.date ) {
    query.date = state.date;
  }

  if ( state.postTypes && state.postTypes.length ) {
    query.postTypes = state.postTypes;
  }

  if ( state.sources && state.sources.length ) {
    query.sources = state.sources;
  }

  if ( state.categories && state.categories.length ) {
    query.categories = state.categories;
  }

  return query;
};
