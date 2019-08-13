import config from 'config';
import getConfig from 'next/config';
import forEach from 'lodash/forEach';

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

export const secondsToHMS = seconds => {
  const isNumber = typeof seconds === 'number';
  const totalRunTime = isNumber ? seconds : Number( seconds );

  if ( Number.isNaN( totalRunTime ) ) return '0:00';

  const h = Math.floor( totalRunTime / 3600 );
  const m = Math.floor( ( totalRunTime % 3600 ) / 60 );
  const mm = h > 0 && m < 10 ? `0${m}` : m;
  const s = Math.floor( totalRunTime % 3600 % 60 );
  const ss = s < 10 ? `0${s}` : s;

  return `${h > 0 ? `${h}:` : ''}${mm}:${ss}`;
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

export const getPluralStringOrNot = ( array, string ) => (
  `${string}${array && array.length > 1 ? 's' : ''}`
);

/**
 * Check if content is from content*america.gov
 * @param {string} string
 */
export const contentRegExp = string => /^.*content.*america\.gov.*$/.test( string );

/**
 * Returns file extension of filename
 * @param {string} filename
 * @param {boolean} withPeriod include the period, .png vs png
 */
export const getFileExt = ( filename, withPeriod = true ) => {
  if ( withPeriod ) {
    return filename.substr( filename.lastIndexOf( '.' ) );
  }
  return filename.substr( filename.lastIndexOf( '.' ) + 1 );
};

export const maybeGetUrlToProdS3 = url => {
  if ( url.startsWith( 'http:' ) || url.startsWith( 'https:' ) ) return url;
  const { publicRuntimeConfig } = getConfig();
  return `https://${publicRuntimeConfig.REACT_APP_AWS_S3_PRODUCTION_BUCKET}.s3.amazonaws.com/${url}`;
};

export const getPathToS3Bucket = () => {
  const { publicRuntimeConfig } = getConfig();
  return `https://${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_BUCKET}.s3.amazonaws.com`;
};

export const getS3Url = assetPath => (
  `${getPathToS3Bucket()}/${assetPath}`
);

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

export const getVimeoId = url => {
  const regExp = /(?:www\.|player\.)?vimeo.com\/(?:channels\/(?:\w+\/)?|groups\/(?:[^/]*)\/videos\/|album\/(?:\d+)\/video\/|video\/|)(\d+)(?:[a-zA-Z0-9_-]+)?/;
  const match = url.match( regExp );

  if ( match ) {
    return match[1];
  }
  return '';
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

/* Fetch id fron url. A Youtube link can either use the
 * short form or long form so check both
 * @param {number} bytes filesize in bytes
 * @param {number} decimals decimal points default 2
 * @return {string} converted filesize text
 */
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

export const getStreamData = ( stream, site = 'youtube', field = 'url' ) => {
  const uri = stream.find( s => s.site.toLowerCase() === site );
  if ( uri && Object.keys( uri ).length > 0 ) {
    return uri[field];
  }
  return null;
};

/**
 * Adds an option to the beggining of an option object array with key+text set to
 * the provided text argument, and a value set to null.
 *
 * @param {Array} options
 * @param {string} text
 * @returns {Array}
 */
export const addEmptyOption = ( options, text = '-' ) => {
  options.unshift( {
    text,
    key: text,
    value: null
  } );
  return options;
};

export const isObject = obj => (
  Object.prototype.toString.call( obj ) === '[object Object]'
);

/**
 * Get array or object length
 * @param {*} obj
 */
export const getCount = obj => {
  if ( isObject( obj ) ) {
    return Object.keys( obj ).length;
  }
  if ( Array.isArray( obj ) ) {
    return obj.length;
  }
  return 0;
};

/**
 * Searches a nested object for a particular key.  Populates
 * an array with all located values of that key
 * @param {object} obj object to search
 * @param {*} keyToMatch object key to find
 * @returns array of matches key values
 */
export const findAllValuesForKey = ( obj, keyToMatch ) => {
  const values = [];

  const find = ( _obj, _keyToMatch ) => {
    forEach( _obj, ( value, key ) => {
      if ( key === keyToMatch ) {
        values.push( value );
      }
      if ( typeof _obj[key] === 'object' ) {
        find( _obj[key], _keyToMatch );
      }
    } );
  };

  find( obj, keyToMatch );

  return values;
};

export const serializeFile = file => new Promise( ( resolve, reject ) => {
  const reader = new FileReader();
  reader.readAsDataURL( file ); // readAsText() or readAsArrayBuffer()
  reader.onload = () => resolve( reader.result );
  reader.onerror = reject;
} );

/**
 * Returns the value of a an object prop using a string path and not object notation
 * @param {object} obj Object containing the prop
 * @param {string} stringPath ath to object property, i.e. 'prop1.prop2'
 */
export const getObjectValueFromStringPath = ( obj, stringPath ) => {
  const path = stringPath.split( '.' );
  return path.reduce( ( acc, cur ) => {
    if ( acc[cur] ) {
      return acc[cur];
    }
    throw new Error( `Property '${cur}' does not exist on object ${acc.toString()}` );
  }, obj );
};


/**
 * Removes duplicate from an array of objects.
 * Accepts the props to compare as an object path in string form
 * @param {array} arr  Array to search
 * @param {string} stringPath path to object property, i.e. 'prop1.prop2'
 *
 * @return {object} Object with duplicates and uniq arrays
 *
 * usage:
 * const result = removeDuplicatesFromArray( [
 *  { person: {  name: 'John Williams', address: { state: 'DC', zip: '22201} } }
 * ], 'address.zip' );
 */
export const removeDuplicatesFromArray = ( arr, stringPath ) => {
  try {
    const duplicates = [];
    const uniq = arr.reduce( ( acc, cur ) => {
      const val = getObjectValueFromStringPath( cur, stringPath );
      const found = acc.find( item => getObjectValueFromStringPath( item, stringPath ) === val );
      if ( !found ) {
        acc.push( cur );
      } else {
        duplicates.push( cur );
      }
      return acc;
    }, [] );
    return { duplicates: duplicates.length ? duplicates : null, uniq };
  } catch ( err ) {
    console.error( err );
  }
};
