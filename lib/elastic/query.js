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
    'author', 'title', 'content.html', 'content.rawText'
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
  const optionsObj = {
    nonPkg: {
      options: [],
      optionsStr: ''
    },
    pkgs: {
      options: [],
      optionsStr: ''
    }
  };

  const hasSelectedTypes = store.filter.postTypes.length;
  const nonPkgPostTypesSelected = hasSelectedTypes && !store.filter.postTypes.includes( 'package' );
  const packagePostTypeOnly = hasSelectedTypes && (
    store.filter.postTypes.map( type => type ).join('') === 'package'
  );
  const nonPkgPostTypes = store.filter.postTypes.filter( postType => postType !== 'package' );

  /* LANGUAGE */
  if ( store.search.language ) {
    // Language field only on non-pkg types
    optionsObj.nonPkg.options.push( getLanguageQry( store.search.language ) );
  }

  /* CATEGORIES */
  if ( store.filter.categories.length ) {
    Object.keys( optionsObj ).forEach( optionType => {
      optionsObj[optionType].options.push( getCategoryQry( store.filter.categories ) );
    } );
  }

  /* SOURCES */
  /* Need to add an elastic keyword analyzer to the owner prop
     mapping before we can query via query string
     options.push( getSourceQry( store.source.currentSources ) );
    */
  if ( store.filter.sources.length ) {
    store.filter.sources.forEach( source => {
      body.orFilter( 'term', 'owner.keyword', source );
    } );
  }

  /* POST TYPES / FORMAT */
  // Only add non-pkg post types to non-pkg query
  if ( nonPkgPostTypes.length ) {
    optionsObj.nonPkg.options.push( getPostTypeQry( nonPkgPostTypes ) );
  }

  // Add pkg type to pkg query if selected
  if ( store.filter.postTypes.includes( 'package' ) ) {
    optionsObj.pkgs.options.push( getPostTypeQry( ['package'] ) );
  }

  /* DATE RANGE */
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

  /* PUBLISH STATUS */
  if ( store.search.sort === 'published' ) {
    body.sort( 'published', 'desc' );
  }

  /*
   * Create string for query_string options
   *
   */
  Object.keys( optionsObj ).forEach( optionType => {
    optionsObj[optionType].optionsStr = optionsObj[optionType].options.reduce( ( acc, value, index, arr ) => {
      if ( index === arr.length - 1 ) {
        /* eslint-disable-next-line no-param-reassign */
        acc += value;
      } else {
        /* eslint-disable-next-line no-param-reassign */
        acc += `${value} AND `;
      }
      return acc;
    }, '' );
  } );

  /* SEARCH TERM */
  // add original search term last
  if ( store.search.term && store.search.term.trim() ) {
    // Queries term by language/unit.language (package type does not have language field)
    const nonPkgOptionsStr = !optionsObj.nonPkg.optionsStr ? '' : `AND ${optionsObj.nonPkg.optionsStr}`;
    const nonPkgQryObj = {
      query: `${maybeFixQuotes( escapeRegExp( store.search.term ) )} ${nonPkgOptionsStr}`
    };

    // Queries term on fields relevant to packages
    const pkgsOptionsStr = !optionsObj.pkgs.optionsStr ? '' : `AND ${optionsObj.pkgs.optionsStr}`;
    const pkgQryObj = {
      query: `${maybeFixQuotes( escapeRegExp( store.search.term ) )} ${pkgsOptionsStr}`
    };

    // if ( hasSelectedTypes ) {
    //   // use the selected types from filter menu
    //   console.log({nonPkgPostTypes})
    //   nonPkgQryObj.fields = getQryFields( nonPkgPostTypes );

    //   if ( store.filter.postTypes.includes( 'package' ) ) {
    //     // Add fields to package query
    //     pkgQryObj.fields = [ ...fields.package ];
    //   }

    // } else {
    //   // use the global default list (search on non-pkg all types)
    //   const nonPkgTypeList = store.global.postTypes.list.filter( type => type.key !== 'package' );
    //   console.log({nonPkgTypeList})
    //   nonPkgQryObj.fields = getQryFields( nonPkgTypeList );

    //   // Add fields to package query
    //   pkgQryObj.fields = [ ...fields.package ];
    // }

    // temp fix - on server render, redux store does not populate with initial global lists
    // if ( !nonPkgQryObj.fields?.length ) {
    //   console.log( '!nonPkgQryObj.fields.length' )
    //   nonPkgQryObj.fields = [ ...new Set( [...fields.post, ...fields.video, ...fields.package] ) ];
    // }

    // Add All Fields for query objects
    [pkgQryObj, nonPkgQryObj].forEach( qry => {
      qry.fields = [...new Set( [...fields.post, ...fields.video, ...fields.package] )];
    } );

    console.log( optionsObj );
    console.log( {
      pkgQryObj,
      nonPkgQryObj
    } );

    // Query non-pkg types only
    if ( nonPkgPostTypesSelected ) {
      console.log( 'Non PKG Types' );
      body.query( 'query_string', nonPkgQryObj );
    // Query pkg type only
    } else if ( packagePostTypeOnly ) {
      console.log( 'PKG Only' );
      body.query( 'query_string', pkgQryObj );
    // Query all types
    } else {
      console.log( 'ALL PKGS & NON-PKGS' );
      body
        .query( 'match_all' )
        .orFilter( 'query_string', nonPkgQryObj )
        .orFilter( 'query_string', pkgQryObj );
    }
  } else {
    console.log( optionsObj.nonPkg.optionStr );
    console.log( optionsObj );

    if ( nonPkgPostTypesSelected ) {
      console.log( 'Non PKG Types' );
      body.query( 'query_string', 'query', optionsObj.nonPkg.optionsStr );
    // Query pkg type only
    } else if ( packagePostTypeOnly ) {
      console.log( 'PKG Only' );
      body.query( 'query_string', 'query', optionsObj.pkgs.optionsStr );
    // Query all types
    } else {
      console.log( 'ALL PKGS & NON-PKGS' );
      body
        .query( 'match_all' )
        .orFilter( 'query_string', 'query', optionsObj.nonPkg.optionsStr )
        .orFilter( 'match', 'type', 'package' );
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
