import Bodybuilder from 'bodybuilder';
import { maybeFixQuotes, escape, escapeRegExp } from '../utils';

// TODO: Create type objects where all type related tasks, vars are held
// i.e. fields to search, parser, etc.
const fields = {
  post: [
    'title^2', 'author', 'content', 'excerpt', 'categories', 'tags'
  ],
  video: [
    'author', 'unit.title^6', 'unit.desc^3', 'unit.transcript.text', 'unit.categories.name', 'unit.tags'
  ],
  package: [
    'owner', 'title'
  ],
  document: [
    'owner', 'title', 'content.html', 'content.rawText', 'countries.name'
  ]
};

export const getAvailableLanguages = item => {
  if ( !item || !item.type ) return [];
  switch ( item.type ) {
    case 'video': {
      const langArr = item.units.reduce( ( langs, unit ) => {
        if ( unit.source && unit.source.length ) {
          langs.push( {
            key: unit.language.locale,
            value: unit.language.display_name,
            text: unit.language.display_name
          } );
        }
        return langs;
      }, [] );
      return langArr;
    }
    case 'post':
      if ( item.languages ) {
        let langArray = [];
        langArray = item.languages.map( post => ( {
          id: post.post_id,
          key: post.language.locale,
          value: post.language.display_name,
          text: post.language.display_name
        } ) );
        langArray.unshift( {
          id: item.id,
          key: item.language.locale,
          value: item.language.display_name,
          text: item.language.display_name
        } );
        return langArray;
      }
      return {
        id: item.post_id,
        key: 'en-us',
        value: 'English',
        text: 'English'
      };
    case 'document':
      return {
        id: item.id,
        key: item.language.locale,
        value: item.language.display_name,
        text: item.language.display_name
      };
    default:
      return [];
  }
};

// Following rules normalize language, categories, tags, etc as they appear at different document levels
// const getLanguageQry = language => `(language.locale: ${language.key} OR unit.language.locale: ${language.key})`;
const getLanguageQry = language => `(language.locale: ${language} OR unit.language.locale: ${language})`;

const getCategoryQry = categories => {
  let qry = '';
  const len = categories.length;
  categories.forEach( ( category, index ) => {
    qry += `categories.id.keyword: ${escape( category )} OR unit.categories.id.keyword: ${escape( category )}`;
    if ( index < len - 1 ) qry += ' OR ';
  } );

  return `(${qry})`;
};

/* Need to add a keyword analyzer  before we can use this method
const getSourceQry = ( sources ) => {
  let qry = '';
  const len = sources.length;
  sources.forEach( ( source, index ) => {
    qry += `owner.keyword: ${source.display_name}`;
    if ( index < len - 1 ) qry += ' OR ';
  } );
  return `(${qry})`;
};
*/

// see note for getSourceQry
// const getCountriesQry = countries => {
//   let qry = '';
//   const len = countries.length;
//   countries.forEach( ( country, index ) => {
//     qry += `countries.name.keyword: ${country}`;
//     if ( index < len - 1 ) qry += ' OR ';
//   } );

//   return `(${qry})`;
// };

const getPostTypeQry = types => {
  let qry = '';
  const len = types.length;
  types.forEach( ( type, index ) => {
    qry += `type.keyword: ${type}`;
    if ( index < len - 1 ) qry += ' OR ';
  } );

  return `(${qry})`;
};

/**
 * Return an array of unique selected types
 * Set object only accepts unique values
 *
 * @param {array} types Selected post types
 * @return Array of unique post types
 */
const getQryFields = ( types = [] ) => {
  const set = new Set();

  types.forEach( t => {
    const flds = t.key ? fields[t.key] : fields[t];
    if ( flds ) {
      flds.forEach( fld => set.add( fld ) );
    }
  } );

  return [...set];
};


export const queryBuilder = ( store, user ) => {
  const body = new Bodybuilder();

  // Filter options for query
  const options = [];

  // Filters
  const {
    postTypes,
    categories,
    sources,
    date,
    dateSelect,
    dateFrom,
    dateTo,
  } = store.filter;

  // Search params
  const {
    language,
    sort,
    term,
  } = store.search;

  // Global static postType list
  const {
    list: globalPostTypes,
  } = store.global.postTypes;

  const hasSelectedTypes = postTypes.length;

  /* LANGUAGE */
  if ( language ) {
    options.push( getLanguageQry( language ) );
  }

  /* CATEGORIES */
  if ( categories.length ) {
    options.push( getCategoryQry( categories ) );
  }

  /* COUNTRIES */
  if ( store.filter.countries.length ) {
    // see notes for getSourceQry
    // optionsObj.pkgs.options.push( getCountriesQry( store.filter.countries ) );
    store.filter.countries.forEach( country => {
      body.orFilter( 'term', 'countries.name.keyword', country );
    } );
  }

  /* SOURCES */
  /* Need to add an elastic keyword analyzer to the owner prop
     mapping before we can query via query string
     options.push( getSourceQry( store.source.currentSources ) );
    */
  if ( sources.length ) {
    body.filter( 'terms', 'owner.keyword', sources );
  }

  /* POST TYPES / FORMAT */
  if ( hasSelectedTypes ) {
    options.push( getPostTypeQry( postTypes ) );
  }

  /* DATE RANGE */
  if ( date !== 'recent' && date !== 'custom' ) {
    body.filter( 'range', 'published', { gte: date } );
  } else if ( dateSelect === 'custom' ) {
    body.filter( 'range', 'published', {
      gte: dateFrom,
      lte: dateTo,
      format: 'MM/dd/yyyy'
    } );
  }

  /* PUBLISH STATUS */
  if ( sort === 'published' ) {
    body.sort( 'published', 'desc' );
  }

  /*
   * Create options string for query_string
   * derived from options set on each optionsObj property
   */

  const optionsStr = options.reduce( ( acc, value, index, arr ) => {
    if ( index === arr.length - 1 ) {
      /* eslint-disable-next-line no-param-reassign */
      acc += value;
    } else {
      /* eslint-disable-next-line no-param-reassign */
      acc += `${value} AND `;
    }
    return acc;
  }, '' );

  /* SEARCH TERM */
  // add original search term last
  if ( term && term.trim() ) {
    const qryObj = {
      query: `${maybeFixQuotes( escapeRegExp( term ) )} AND ${optionsStr}`
    };

    if ( hasSelectedTypes ) {
      // use the selected types from filter menu
      qryObj.fields = getQryFields( postTypes );
    } else {
      // use the global default list (search on all non-pkg types)
      qryObj.fields = getQryFields( globalPostTypes );
    }

    /* Set query w/ search term */
    body.query( 'query_string', qryObj );
  } else {
    /* Set query w/o search term */
    body.query( 'query_string', 'query', optionsStr );
  }

  // Boost more recent content
  body.orQuery( 'range', 'published', { boost: 8, gte: 'now-7d' } );
  body.orQuery( 'range', 'published', { boost: 7, gte: 'now-30d' } );
  body.orQuery( 'range', 'published', { boost: 5, gte: 'now-365d' } );
  body.orQuery( 'range', 'published', { boost: 3, gte: 'now-730d' } );

  // Do not fetch courses or page content type
  body.notQuery( 'match', 'type.keyword', 'courses' );
  body.notQuery( 'match', 'type.keyword', 'page' );

  // if the user is not present, remove internal content types
  // will need to add more robust/granual checking mechanism,
  // i.e. checking the field visibility status
  // when requirements dictate hiding fields within a document
  // for example, showing video but not showing its editable file
  if ( !user ) {
    body.notQuery( 'match', 'type.keyword', 'document' );
    body.notQuery( 'match', 'type.keyword', 'package' );
  }

  // body.query( 'query_string', 'query', optionStr ); // return all for TESTING
  return body.build();
};

export const queryBuilderAggs = store => {
  const body = new Bodybuilder();
  body.size( 0 );

  // Filter options for query
  const options = [];

  // Filters
  const {
    postTypes,
    date,
    dateSelect,
    dateFrom,
    dateTo,
  } = store.filter;

  // Search params
  const {
    language,
    term,
  } = store.search;

  // Global static postType list
  const {
    list: globalPostTypes,
  } = store.global.postTypes;

  const hasSelectedTypes = postTypes.length;

  if ( language ) {
    options.push( getLanguageQry( language ) );
  }

  if ( hasSelectedTypes ) {
    // Only add non-pkg post types to non-pkg query
    options.push( getPostTypeQry( postTypes ) );
  }

  if ( date !== 'recent' && date !== 'custom' ) {
    body.filter( 'range', 'published', { gte: date } );
  } else if ( dateSelect === 'custom' ) {
    body.filter( 'range', 'published', {
      gte: dateFrom,
      lte: dateTo,
      format: 'MM/dd/yyyy'
    } );
  }

  const optionsStr = options.reduce( ( acc, value, index, arr ) => {
    if ( index === arr.length - 1 ) {
      /* eslint-disable-next-line no-param-reassign */
      acc += value;
    } else {
      /* eslint-disable-next-line no-param-reassign */
      acc += `${value} AND `;
    }
    return acc;
  }, '' );

  // add original search term last
  if ( term && term.trim() ) {
    const qryObj = {
      query: `${maybeFixQuotes( escapeRegExp( term ) )} AND ${optionsStr}`
    };

    if ( hasSelectedTypes ) {
      // use the selected types from filter menu
      qryObj.fields = getQryFields( postTypes );
    } else {
      // use the global default list (search on all types)
      qryObj.fields = getQryFields( globalPostTypes );
    }

    body.query( 'query_string', qryObj );
  } else {
    body.query( 'query_string', 'query', optionsStr );
  }

  // Boost more recent content
  body.orQuery( 'range', 'published', { boost: 8, gte: 'now-7d' } );
  body.orQuery( 'range', 'published', { boost: 7, gte: 'now-30d' } );
  body.orQuery( 'range', 'published', { boost: 5, gte: 'now-365d' } );
  body.orQuery( 'range', 'published', { boost: 3, gte: 'now-730d' } );

  // Do not fetch courses or page content type
  body.notQuery( 'match', 'type.keyword', 'courses' );
  body.notQuery( 'match', 'type.keyword', 'page' );

  body.agg( 'terms', 'unit.categories.id.keyword', { size: 100 }, 'unitId' );
  body.agg( 'terms', 'categories.id.keyword', { size: 100 }, 'id' );
  body.agg( 'terms', 'owner.keyword', { size: 100 }, 'source' );

  // body.query( 'query_string', 'query', optionStr ); // return all for TESTING
  return body.build();
};
