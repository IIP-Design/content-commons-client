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
    const flds = fields[t.key];
    if ( flds ) {
      flds.forEach( fld => set.add( fld ) );
    }
  } );

  return [...set];
};


export const queryBuilder = store => {
  const body = new Bodybuilder();
  const options = [];
  const hasSelectedTypes = store.filter.postTypes.length;

  if ( store.search.language ) {
    options.push( getLanguageQry( store.search.language ) );
  }

  if ( store.filter.categories.length ) {
    options.push( getCategoryQry( store.filter.categories ) );
  }

  /* Need to add an elastic keyword analyzer to the owner prop
     mapping before we can query via query string
     options.push( getSourceQry( store.source.currentSources ) );
    */
  if ( store.filter.sources.length ) {
    store.filter.sources.forEach( source => {
      body.orFilter( 'term', 'owner.keyword', source );
    } );
  }

  if ( hasSelectedTypes ) {
    options.push( getPostTypeQry( store.filter.postTypes ) );
  }

  if ( store.filter.date !== 'recent' ) {
    if ( store.filter.date !== 'custom' ) {
      body.filter( 'range', 'published', { gte: store.filter.date } );
    } else if ( store.filter.dateSelect === 'custom' ) {
      body.filter( 'range', 'published', {
        gte: store.filter.dateFrom,
        lte: store.filter.dateTo,
        format: 'MM/dd/yyyy'
      } );
    }
  }

  if ( store.search.sort === 'published' ) {
    body.sort( 'published', 'desc' );
  }

  const optionStr = options.reduce( ( acc, value, index, arr ) => {
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
  if ( store.search.term && store.search.term.trim() ) {
    const qryObj = { query: `(${maybeFixQuotes( escapeRegExp( store.search.term ) )}) AND (${optionStr})` };
    if ( hasSelectedTypes ) {
      // use the selected types from filter menu
      qryObj.fields = getQryFields( store.filter.postTypes );
    } else {
      // use the global default list (search on all types)
      qryObj.fields = getQryFields( store.global.postTypes.list );
    }
    // temp fix - on server render, redux store does not populate with initial global lists
    if ( !qryObj.fields.length ) {
      qryObj.fields = new Set( [...fields.post, ...fields.video] );
    }
    body.query( 'query_string', qryObj );
  } else {
    body
      .query( 'match_all' )
      .orFilter( 'query_string', 'query', optionStr );

    if ( !hasSelectedTypes || store.filter.postTypes.includes( 'package' ) ) {
      body.orFilter( 'match', 'type', 'package' );
    }
  }

  // Boost more recent content
  body.orQuery( 'range', 'published', { boost: 8, gte: 'now-7d' } );
  body.orQuery( 'range', 'published', { boost: 7, gte: 'now-30d' } );
  body.orQuery( 'range', 'published', { boost: 5, gte: 'now-365d' } );
  body.orQuery( 'range', 'published', { boost: 3, gte: 'now-730d' } );

  // Do not fetch courses or page content type
  body.notQuery( 'match', 'type.keyword', 'courses' );
  body.notQuery( 'match', 'type.keyword', 'page' );

  // body.query( 'query_string', 'query', optionStr ); // return all for TESTING
  return body.build();
};

export const queryBuilderAggs = store => {
  const body = new Bodybuilder();
  body.size( 0 );
  const options = [];
  const hasSelectedTypes = store.filter.postTypes.length;

  if ( store.search.language ) {
    options.push( getLanguageQry( store.search.language ) );
  }

  if ( hasSelectedTypes ) {
    options.push( getPostTypeQry( store.filter.postTypes ) );
  }

  if ( store.filter.date !== 'recent' ) {
    if ( store.filter.date !== 'custom' ) {
      body.filter( 'range', 'published', { gte: store.filter.date } );
    } else if ( store.filter.dateSelect === 'custom' ) {
      body.filter( 'range', 'published', {
        gte: store.filter.dateFrom,
        lte: store.filter.dateTo,
        format: 'MM/dd/yyyy'
      } );
    }
  }

  const optionStr = options.reduce( ( acc, value, index, arr ) => {
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
  if ( store.search.term && store.search.term.trim() ) {
    const qryObj = { query: `(${maybeFixQuotes( escapeRegExp( store.search.term ) )}) AND (${optionStr})` };
    if ( hasSelectedTypes ) {
      // use the selected types from filter menu
      qryObj.fields = getQryFields( store.filter.postTypes );
    } else {
      // use the global default list (search on all types)
      qryObj.fields = getQryFields( store.global.postTypes.list );
    }
    // temp fix - on server render, redux store does not populate with initial global lists
    if ( !qryObj.fields.length ) {
      qryObj.fields = new Set( [...fields.post, ...fields.video] );
    }
    body.query( 'query_string', qryObj );
  } else {
    body.query( 'query_string', 'query', optionStr );
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
