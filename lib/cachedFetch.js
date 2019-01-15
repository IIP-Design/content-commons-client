// Genrally used for fetches that are not stored in the redux store

import lscache from 'lscache';
import fetch from 'isomorphic-unfetch';
import config from '../config';

lscache.setExpiryMilliseconds( 1 );

/**
 * Returns data based content-type. Markdown files (.md) need to
 * use response.text() method
 *
 * @param {object} response response from xhr call
 */
const fetchDataFromResponse = async response => {
  let data;
  const contentType = response.headers.get( 'Content-Type' );
  if ( !contentType.includes( 'application/json' ) ) {
    data = await response.text();
  } else {
    data = await response.json();
  }

  return data;
};


/**
 * Caches xhr response if executed on the client and
 * checks cache before executing client side call
 *
 * @param {string} url xhr endpoint
 * @param {objecct} options xhr configuration
 */
const cachedFetch = async ( url, options ) => {
  let response;
  let error;
  let data;

  // We don't cache anything when server-side rendering.
  // That way if users refresh the page they always get fresh data.
  // The response is cached in the component's componentDidMount
  // method if ssr
  if ( typeof window === 'undefined' ) {
    response = await fetch( url, options );
    error = response.status > 200 ? response.status : false;
    data = await fetchDataFromResponse( response );
    return { data, error };
  }

  let cachedResponse = lscache.get( url );

  // If there is no cached response,
  // do the actual call and store the response
  if ( cachedResponse === null ) {
    response = await fetch( url, options );
    error = response.status > 200 ? response.status : false;
    cachedResponse = await fetchDataFromResponse( response );

    // only cache response if not an error
    if ( cachedResponse && !error ) {
      lscache.set( url, cachedResponse, config.TIME_TO_STALE );
    }
  }

  // include an error as part of the retrun
  // in the event the client side call fails
  return { data: cachedResponse, error };
};

/**
 * Called from client in the event of server side render
 * @param {string} key key to store data
 * @param {string} val data to store
 */
export const overrideCache = ( key, val ) => {
  lscache.set( key, val, config.TIME_TO_STALE );
};

export default cachedFetch;
