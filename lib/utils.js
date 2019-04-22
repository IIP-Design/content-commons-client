import config from 'config';

export const millisToSeconds = ( millis, digits = 2 ) => {
  if ( typeof millis !== 'number' ) {
    throw new Error( '_millisToSeconds(): Provided parameter is not a number' );
  }
  return ( ( millis % 60000 ) / 1000 ).toFixed( digits );
};

export const millisToMinutesAndSeconds = ( millis, digits ) => {
  const minutes = Math.floor( millis / 60000 );
  const seconds = millisToSeconds( millis, digits );
  return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
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

/**
 * Replace subset of string between any starting and ending index
 * Define number of characters to display at start and end of string, characters in
 * between will be replaced with supplied 'replaceWith' content, defaulting to ellipsis
 * @param {string} str string to be truncated
 * @param {number} showFirstNumChars number of characters to display from start of string
 * @param {number} showLastNumChars number of characters to display from end of string
 * @param {*} replaceWith character to replace subset of string, default is ellipsis
 * @return {string} replacedStr
 */
export const truncateAndReplaceStr = ( str, showFirstNumChars, showLastNumChars, replaceWith = '...' ) => {
  const subString = str.substring( showFirstNumChars, str.length - showLastNumChars );
  const replacedStr = str.replace( subString, replaceWith );
  return replacedStr;
};

/**
 * Use as an argument for Array.prototype.sort()
 * to sort an array of objects by a specified
 * object key, e.g.,
 * `array.sort(compareValues('key', 'asc'))`.
 * Object values must be a string or number.
 * @param {string} key Object key
 * @param {string} order order of results: asc or dsc
 * @return {number} 0, -1, 1
 */
export const compareValues = ( key, order = 'asc' ) => (
  function( a, b ) {
    // check if property exists on either object
    if ( !a[key] || !b[key] ) return 0;

    const varA = ( typeof a[key] === 'string' )
      ? a[key].toUpperCase()
      : a[key];
    const varB = ( typeof b[key] === 'string' )
      ? b[key].toUpperCase()
      : b[key];

    let comparison = 0;
    if ( varA > varB ) {
      comparison = 1;
    } else if ( varA < varB ) {
      comparison = -1;
    }
    return (
      ( order === 'desc' ) ? ( comparison * -1 ) : comparison
    );
  }
);

export const formatDate = (
  dateString,
  locale = 'en-US',
  options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric'
  }
) => {
  const d = dateString.split( /[^0-9]/ );
  const dateTime = new Date( d[0], d[1] - 1, d[2], d[3], d[4], d[5] );
  return dateTime.toLocaleString( locale, options );
};

export const formatBytes = ( bytes, decimals ) => {
  if ( bytes === 0 ) return;
  const k = 1024;
  const dm = decimals || 2;
  const sizes = [
    'Bytes',
    'KB',
    'MB',
    'GB',
    'TB'
  ];
  const i = Math.floor( Math.log( bytes ) / Math.log( k ) );
  return `${parseFloat( ( bytes / ( k ** i ) ).toFixed( dm ) )}  ${sizes[i]}`;
};

export const getPluralStringOrNot = ( array, string ) => (
  `${string}${array && array.length > 1 ? 's' : ''}`
);

export const getStreamData = ( stream, site = 'youtube', field = 'url' ) => {
  const uri = stream.find( s => s.site.toLowerCase() === site );
  if ( uri && Object.keys( uri ).length > 0 ) {
    return uri[field];
  }
  return null;
};
