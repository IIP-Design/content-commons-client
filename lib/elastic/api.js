import axios from 'axios';
import bodybuilder from 'bodybuilder';
import getConfig from 'next/config';
import { queryBuilderAggs } from 'lib/elastic/query';

const { publicRuntimeConfig } = getConfig();
const SEARCH = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/search`;
const OPENNET = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/task/opennet`;


export const queryRequest = ( body, esToken ) => axios
  .post( SEARCH, body, {
    headers: { Authorization: `Bearer ${esToken}` },
  } )
  .then( response => response.data );

/**
 * Get languages that have associated content
 */
export const languageAggRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 0 )
      .agg( 'terms', 'unit.language.locale.keyword', { size: 50 }, 'unitLocale' )
      .agg( 'terms', 'language.locale.keyword', { size: 50 }, 'locale' )
      .build(),
  } )
  .then( response => response.data );

/**
 * Get all languages in languages index
 */
export const languagesRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 200 )
      .query( 'query_string', 'query', '_type: language' )
      .build(),
  } )
  .then( response => response.data );

/**
 * Get categories that have associated content
 */
export const categoryAggRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 0 )
      .agg( 'terms', 'unit.categories.id.keyword', {}, 'unitId' )
      .agg( 'terms', 'categories.id.keyword', {}, 'id' )
      .build(),
  } )
  .then( response => response.data );

/**
 * Get primary categories
 */
export const categoryPrimaryRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 100 )
      .query( 'query_string', 'query', '_type: term AND primary: true' )
      .build(),
  } )
  .then( response => response.data );

/**
 * Get the categories that match supplied ids,used to fetch category display name
 * TODO: search only taxonomy index
 *
 * @param {array} ids taxonomy ids
 */
export const categoryValueNameRequest = ( ids = [] ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 200 )
      .orFilter( 'terms', '_id', ids.map( id => id.key ) )
      .build(),
  } )
  .then( response => response.data );
/**
 * Get aggs for sources and categories that have associated content
 */
export const AggsRequest = store => axios
  .post( SEARCH, { body: queryBuilderAggs( store ) } )
  .then( response => response.data );

/**
 * Get all sources that have associated content
 */
export const sourceAggRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 0 )
      .agg( 'terms', 'owner.keyword', {}, 'source' )
      .build(),
  } )
  .then( response => response.data );

/**
 * Get all post types that have associated content
 */
export const postTypeAggRequest = user => {
  const options = user ? {} : { exclude: ['document', 'package'] };

  return axios
    .post( SEARCH, {
      body: bodybuilder()
        .size( 0 )
        .agg( 'terms', 'type.keyword', options, 'postType' )
        .build(),
    } )
    .then( response => response.data );
};


/**
 *
 * @param {*} currentType
 * @param {*} currentLang
 */
export const typeRecentsRequest = ( currentType, currentLang, user ) => {
  let body = {};
  const isPublic = !user || user?.id === 'public';

  // Create base query
  body = bodybuilder().size( 3 )
    .query( 'match', 'type', currentType )
    .sort( 'published', 'desc' );

  // Add video & article specific query to base
  if ( currentType === 'post' || currentType === 'video' ) {
    body = body.query(
      'query_string',
      'query',
      `(language.locale: ${currentLang} OR unit.language.locale: ${currentLang})`,
    );
  }

  // Add PUBLIC visibility if video or graphic. Video and graphics also have INTERNAL projects
  // Need to add PUBLIC to ensure you pull 3 PUBLIC projects as opposed to the latest 3 as this
  // could result in < 3 returning as the internal projects will be stripped on the server
  if ( ( currentType === 'video' || currentType === 'graphic' ) && isPublic ) {
    body = body.query( 'match', 'visibility', 'PUBLIC' );
  }

  return axios.post(
    SEARCH, { body: body.build() }, {
      headers: { Authorization: `Bearer ${user?.esToken}` },
    },
  ).then( response => response.data );
};


/**
 * Get 4 recent type documents, descending order
 * @param {*} type string
 */
export const typeRequestDesc = ( type, user ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 4 )
      .query( 'match', 'type', type )
      .sort( 'created', 'desc' )
      .build(),
  }, {
    headers: { Authorization: `Bearer ${user?.esToken}` },
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );


/**
 * Request all document files for a package
 * @param {*} docIdsArray array
 */
export const packageDocumentsRequest = ( docIdsArray, user ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .query( 'terms', 'id', docIdsArray )
      .size( 100 )
      .sort( 'published', 'desc' )
      .build(),
  }, {
    headers: { Authorization: `Bearer ${user?.esToken}` },
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );

/**
 *
 * @param {*} currentType
 * @param {*} currentLang
 */
export const typePrioritiesRequest = ( term, categories, tags, currentLang, user ) => {
  const fields = [
    'title^2',
    'content',
    'excerpt',
    'unit.title^6',
    'unit.desc^3',
    'unit.transcript.text',
  ];

  let query = `(language.locale: ${currentLang} OR unit.language.locale: ${currentLang} OR images.language.locale: ${currentLang}) AND (`;

  if ( term ) {
    query += `(${term})`;
  }

  if ( categories?.length ) {
    if ( term ) {
      query += ' OR ';
    }
    query += categories.reduce( ( acc, cur, i, arr ) => {
      let qry = `${acc}categories.name.keyword: (${cur}) OR unit.categories.name.keyword: (${cur})`;

      if ( i + 1 !== arr.length ) qry += ' OR ';

      return qry;
    }, '' );
  }

  if ( tags?.length ) {
    if ( term || categories?.length ) {
      query += ' OR ';
    }
    query += tags.reduce( ( acc, cur, i, arr ) => {
      let qry = `${acc}tags.name.keyword: (${cur}) OR unit.tags.name.keyword: (${cur})`;

      if ( i + 1 !== arr.length ) qry += ' OR ';

      return qry;
    }, '' );
  }

  query += ')';

  return axios
    .post( SEARCH, {
      body: bodybuilder()
        .size( 3 )
        .query( 'query_string', { query, fields } )
        .orQuery( 'range', 'published', { boost: 8, gte: 'now-7d' } )
        .orQuery( 'range', 'published', { boost: 7, gte: 'now-30d' } )
        .orQuery( 'range', 'published', { boost: 5, gte: 'now-90d' } )
        .orQuery( 'range', 'published', { boost: 3, gte: 'now-365d' } )
      // Filter out docs & pkgs
        .notQuery( 'match', 'type.keyword', 'document' )
        .notQuery( 'match', 'type.keyword', 'package' )
        .build(),
    }, {
      headers: { Authorization: `Bearer ${user?.esToken}` },
    } )
    .then( response => response.data );
};


/**
 *
 * @param {*} site
 * @param {*} postId
 */
export const getItemRequest = ( site, postId, useIdKey = false, user ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 1 )
      .query( 'query_string', 'query', `(site: ${site} AND ${useIdKey ? 'id' : 'post_id'}: ${postId})` )
      .build(),
  }, {
    headers: { Authorization: `Bearer ${user?.esToken}` },
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );


export const getTermsRequest = ( key, values, user ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .query( 'terms', key, values )
      .sort( 'published', 'desc' )
      .build(),
  }, {
    headers: { Authorization: `Bearer ${user?.esToken}` },
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );


export const getOpenNetRequest = () => axios.get( OPENNET ).then( response => response.data );
