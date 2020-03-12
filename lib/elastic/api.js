import axios from 'axios';
import bodybuilder from 'bodybuilder';
import getConfig from 'next/config';
import { queryBuilderAggs } from 'lib/elastic/query';
import cookie from 'js-cookie';

const { publicRuntimeConfig } = getConfig();
const SEARCH = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/search`;
const OPENNET = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/task/opennet`;

export const queryRequest = body => {
  const esToken = cookie.get( 'ES_TOKEN' );
  return axios
    .post( SEARCH, body, {
      headers: { Authorization: `Bearer ${esToken}` }
    } )
    .then( response => response.data );
};

/**
 * Get languages that have associated content
 */
export const languageAggRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 0 )
      .agg( 'terms', 'unit.language.locale.keyword', { size: 50 }, 'unitLocale' )
      .agg( 'terms', 'language.locale.keyword', { size: 50 }, 'locale' )
      .build()
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
      .build()
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
      .build()
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
      .build()
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
      .build()
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
      .build()
  } )
  .then( response => response.data );

/**
 * Get all post types that have associated content
 */
export const postTypeAggRequest = () => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 0 )
      .agg( 'terms', 'type.keyword', {}, 'postType' )
      .build()
  } )
  .then( response => response.data );

/**
 *
 * @param {*} currentType
 * @param {*} currentLang
 */
export const typeRecentsRequest = ( currentType, currentLang ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 3 )
      .query( 'match', 'type', currentType )
      .query( 'query_string', 'query', `(language.locale: ${currentLang} OR unit.language.locale: ${currentLang})` )
      .sort( 'published', 'desc' )
      .build()
  } )
  .then( response => response.data );

/**
 * Get 4 recent type documents, descending order
 * @param {*} type string
 */
export const typeRequestDesc = type => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 4 )
      .query( 'match', 'type', type )
      .sort( 'published', 'desc' )
      .build()
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );

/**
 * Request all document files for a package
 * @param {*} docIdsArray array
 */
export const packageDocumentsRequest = docIdsArray => axios
  .post( SEARCH, {
    body: bodybuilder()
      .query( 'terms', 'id', docIdsArray )
      .sort( 'published', 'desc' )
      .build()
  } )
  .then( response => response.data )
  .catch( error => console.log( error ) );

/**
 *
 * @param {*} currentType
 * @param {*} currentLang
 */
export const typePrioritiesRequest = ( term, categories, currentLang ) => {
  const fields = [
    'title^2',
    'author',
    'content',
    'excerpt',
    'categories',
    'tags',
    'author',
    'unit.title^6',
    'unit.desc^3',
    'unit.transcript.text',
    'unit.categories.name',
    'unit.tags'
  ];

  let query = `${term}`;
  query += ` AND (language.locale: ${currentLang} OR unit.language.locale: ${currentLang})`;
  if ( categories.length ) {
    query += ' AND (';
    categories.forEach( ( category, i ) => {
      query += `categories.id.keyword: ${category.key} OR unit.categories.id.keyword: ${category.key}`;
      if ( i + 1 !== categories.length ) query += ' OR ';
    } );
    query += ')';
  }

  return axios
    .post( SEARCH, {
      body: bodybuilder()
        .size( 3 )
        .query( 'query_string', { query, fields } )
        .orQuery( 'range', 'published', { boost: 8, gte: 'now-7d' } )
        .orQuery( 'range', 'published', { boost: 7, gte: 'now-30d' } )
        .orQuery( 'range', 'published', { boost: 5, gte: 'now-90d' } )
        .orQuery( 'range', 'published', { boost: 3, gte: 'now-365d' } )
        .build()
    } )
    .then( response => response.data );
};

/**
 *
 * @param {*} site
 * @param {*} postId
 */
export const getItemRequest = ( site, postId, useIdKey = false ) => axios
  .post( SEARCH, {
    body: bodybuilder()
      .size( 1 )
      .query( 'query_string', 'query', `(site: ${site} AND ${useIdKey ? 'id' : 'post_id'}: ${postId})` )
      .build()
  } )
  .then( response => response.data );

export const getOpenNetRequest = () => axios.get( OPENNET ).then( response => response.data );
