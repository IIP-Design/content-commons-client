import config from 'config';

export const millisToSeconds = millis => {
  if ( typeof millis !== 'number' ) {
    throw new Error( '_millisToSeconds(): Provided parameter is not a number' );
  }
  return ( ( millis % 60000 ) / 1000 ).toFixed( 2 );
};

export const numberWithCommas = number => {
  if ( typeof number !== 'number' ) {
    throw new Error( 'Error: Parameter provided is not a number' );
  }
  return number.toString().replace( /\B(?=(\d{3})+(?!\d))/g, ',' );
};

/**
 * Escape the id if the first letter is a reserved character
 * @param {string } id ES _id
 */
export const escape = id => {
  const re = /[+\-=!(){}[\]"~*?:\\^/]/;
  return re.test( id.charAt( 0 ) ) ? `\\${id}` : id;
};

export const escapeRegExp = string => string.replace( /[.*+-=&!?^~${}()|[\]\\]/g, '\\$&' );

/**
 * If there are an odd number of quotes in the query string is will cause
 * an error. So in that case a string is returned with some quotes escaped
 * to prevent error.
 *
 * @param str
 * @returns string
 */
export const maybeFixQuotes = str => {
  const quoteCount = str.replace( /[^"]/g, '' ).length;

  // If only 1 quote then escape it
  if ( quoteCount === 1 ) return str.replace( '"', '\\"' );
  // If an odd number of quotes then escape all the ones in the middle
  if ( quoteCount % 2 === 1 ) {
    const parts = str.split( '"' );
    return `${parts[0]}"${parts.slice( 1, -1 ).join( '\\"' )}"${parts[parts.length - 1]}`;
  }
  return str;
};

export const capitalizeFirst = str => str.substr( 0, 1 ).toUpperCase() + str.substr( 1 );
export const titleCase = str => str
  .toLowerCase()
  .split( ' ' )
  .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
  .join( ' ' );

/**
 *
 * @param {*} timeSinceLastLoad number in milliseconds time since last saved, generally used to check redux store
 */
export const isDataStale = timeSinceLastLoad => ( Date.now() - timeSinceLastLoad ) > config.TIME_TO_STALE;

export const createHashMap = ( array, key ) => (
  array.reduce( ( acc, obj ) => ( {
    ...acc,
    [obj[key]]: obj
  } ), {} )
);

/**
 * Fetch id fron url. A Youtube link can either use the
 * short form or long form so check both
 * @param {string} url youtube share url
 * @return youtube id
 */
export const getYouTubeId = url => {
  const reShort = /https:\/\/youtu.be\/(.*)/;
  const reLong = /https:\/\/www.youtube.com\/watch\?v=(.*)/;
  const idShort = url.match( reShort );
  const idLong = url.match( reLong );
  if ( idShort ) {
    return idShort[1];
  } if ( idLong ) {
    return idLong[1];
  }
  return null;
};
