/* eslint-disable no-mixed-operators */
import config from 'config';
import getConfig from 'next/config';
import forEach from 'lodash/forEach';
import htmlParser from 'react-markdown/plugins/html-parser';

export const millisToSeconds = ( millis, digits = 2 ) => {
  if ( typeof millis !== 'number' ) {
    throw new Error( '_millisToSeconds(): Provided parameter is not a number' );
  }

  return ( ( millis % 60000 ) / 1000 ).toFixed( digits ); // eslint-disable-line no-extra-parens
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
  const m = Math.floor( ( totalRunTime % 3600 ) / 60 ); // eslint-disable-line no-extra-parens
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

export const getPluralStringOrNot = ( array, string ) => `${string}${array && array.length > 1 ? 's' : ''}`;

/**
 * Check if content is from content*america.gov
 * @param {string} string
 */
export const contentRegExp = string => ( /^.*content.*america\.gov.*$/ ).test( string );

/**
 * Returns file extension of filename
 * @param {string} filename
 * @param {boolean} withPeriod include the period, .png vs png
 */
export const getFileExt = ( filename, withPeriod = true ) => {
  if ( typeof filename !== 'string' ) return '';

  const index = filename.lastIndexOf( '.' );
  const hasExt = index !== -1;

  if ( withPeriod ) {
    return hasExt ? filename.substr( index ) : '';
  }

  return hasExt ? filename.substr( index + 1 ) : '';
};

/**
 * Returns file name without its extension
 * @param {string} filename
 */
export const getFileNameNoExt = filename => {
  if ( filename && typeof filename === 'string' ) {
    const extension = getFileExt( filename );

    return filename.replace( extension, '' );
  }

  return '';
};

export const maybeGetUrlToProdS3 = url => {
  if ( url.startsWith( 'http:' ) || url.startsWith( 'https:' ) ) return url;
  const { publicRuntimeConfig } = getConfig();

  return `https://${publicRuntimeConfig.REACT_APP_AWS_S3_PRODUCTION_BUCKET}.s3.amazonaws.com/${url}`;
};

/**
 * Returns the path to S3 bucket
 * @param {string} type The bucket type to return
 * @returns {string} URL to appropriate S3 bucket, defaults to the production bucket
 */
export const getPathToS3Bucket = type => {
  const { publicRuntimeConfig } = getConfig();

  let bucket = publicRuntimeConfig.REACT_APP_AWS_S3_PRODUCTION_BUCKET;

  if ( type === 'authoring' ) {
    bucket = publicRuntimeConfig.REACT_APP_AWS_S3_AUTHORING_BUCKET;
  }

  return `https://${bucket}.s3.amazonaws.com`;
};

/**
 * Gets the full URL to an object in the S3 authoring bucket given the asset path
 * @param {string} assetPath The key for the S3 object
 */
export const getS3Url = assetPath => `${getPathToS3Bucket( 'authoring' )}/${assetPath}`;

/**
 * Returns the asset path for an asset in the production bucket
 * @param {string} url The URL to an asset in an S3 bucket
 * @returns {string} The S3 URL asset path
 */
export const getS3UrlKey = ( url, bucket ) => {
  const path = getPathToS3Bucket( bucket );

  const key = url.includes( path ) ? url.replace( `${path}/`, '' ) : '';

  return key;
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

export const removeFileExt = file => {
  if ( !file ) return;

  return file.substr( 0, file.lastIndexOf( '.' ) );
};

export const titleCase = str => str
  .toLowerCase()
  .split( ' ' )
  .map( word => word.charAt( 0 ).toUpperCase() + word.slice( 1 ) )
  .join( ' ' );

/**
 *
 * @param {*} timeSinceLastLoad number in milliseconds time since last saved, generally used to check redux store
 */
export const isDataStale = timeSinceLastLoad => Date.now() - timeSinceLastLoad > config.TIME_TO_STALE;

export const createHashMap = ( array, key ) => array.reduce( ( acc, obj ) => ( {
  ...acc,
  [obj[key]]: obj,
} ), {} );

/**
 * Fetch id from url. A YouTube link can either use the
 * short form or long form so check both
 * @param {string} url YouTube share url
 * @return YouTube id
 */
export const getYouTubeId = url => {
  const reShort = /https:\/\/youtu.be\/(.*)/;
  const reEmbed = /https:\/\/www.youtube.com\/embed\/(.*)/;
  const reLong = /https:\/\/www.youtube.com\/watch\?v=(.*)/;
  const idShort = url.match( reShort );
  const idEmbed = url.match( reEmbed );
  const idLong = url.match( reLong );

  if ( idShort ) {
    return idShort[1];
  } if ( idLong ) {
    return idLong[1];
  } if ( idEmbed ) {
    return idEmbed[1];
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
export const compareValues = ( key, order = 'asc' ) => function( a, b ) {
  // check if property exists on either object
  if ( !a[key] || !b[key] ) return 0;

  const varA = typeof a[key] === 'string'
    ? a[key].toUpperCase()
    : a[key];
  const varB = typeof b[key] === 'string'
    ? b[key].toUpperCase()
    : b[key];

  let comparison = 0;

  if ( varA > varB ) {
    comparison = 1;
  } else if ( varA < varB ) {
    comparison = -1;
  }

  return (
    order === 'desc' ? comparison * -1 : comparison
  );
};
export const formatDate = (
  dateString,
  locale = 'en-US',
  options = {
    month: 'long',
    day: 'numeric',
    year: 'numeric',
  },
) => {
  const d = dateString.split( /[^0-9]/ );
  const dateTime = new Date( d[0], d[1] - 1, d[2], d[3], d[4], d[5] );

  return dateTime.toLocaleString( locale, options );
};

/*
 * Fetch id from url. A YouTube link can either use the
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
    'TB',
  ];
  const i = Math.floor( Math.log( bytes ) / Math.log( k ) );

  return `${parseFloat( ( bytes / k ** i ).toFixed( dm ) )}  ${sizes[i]}`;
};

export const getStreamData = ( stream, site = 'youtube', field = 'url' ) => {
  const uri = stream.find( s => s.site.toLowerCase() === site );

  if ( uri && Object.keys( uri ).length > 0 ) {
    return uri[field];
  }

  return null;
};

/**
 * Adds an option to the beginning of an option object array with key+text set to
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
    value: null,
  } );

  return options;
};

export const isObject = value => Object.prototype.toString.call( value ) === '[object Object]';

/**
 * Get array, string, or object length
 * @param {*} value
 */
export const getCount = value => {
  if ( isObject( value ) ) {
    return Object.keys( value ).length;
  }
  if ( Array.isArray( value ) || typeof value === 'string' ) {
    return value.length;
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

/**
 * Converts File Object to dataUrl
 * @param {File} file File to serialize
 */
export const serializeFile = file => new Promise( ( resolve, reject ) => {
  const reader = new FileReader();

  reader.readAsDataURL( file ); // readAsText() or readAsArrayBuffer()
  reader.onload = () => resolve( reader.result );
  reader.onerror = reject;

  return reader;
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
    // console.error( err );
  }
};

/**
 * Get the API URL for downloading a file (image, video, etc) from the production S3 bucket.
 * This prevents the file from automatically opening or playing as a stream instead of a download.
 * @param url
 * @param filename
 * @returns {string}
 */
export const getFileDownloadUrl = ( url, filename ) => {
  const { publicRuntimeConfig } = getConfig();
  const endpoint = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/task/download`;

  const params = JSON.stringify( { key: getS3UrlKey( url ), filename, url } );

  return `${endpoint}/${btoa( unescape( encodeURIComponent( params ) ) )}`;
};

/**
 * Gets the file name from a url
 * @param {string} url URL to a file
 * @returns {string}
 */
export const getFileNameFromUrl = url => {
  if ( typeof url === 'string' ) {
    const endIndex = url.lastIndexOf( '?' );
    const startIndex = url.lastIndexOf( '/' ) + 1;

    return endIndex !== -1
      ? url.slice( startIndex, endIndex )
      : url.slice( startIndex );
  }

  return '';
};

export const getApolloErrors = error => {
  let errs = [];
  const { graphQLErrors, networkError, otherError } = error;

  if ( graphQLErrors ) {
    errs = graphQLErrors.map( error => error.message );
  }
  if ( networkError ) {
    errs.push( networkError );
  }

  if ( otherError ) {
    errs.push( otherError );
  }

  return errs;
};

/**
 * Execute a POST request for a zip
 * @param {string} title  Name to be used for zip package
 * @param {array} files files to zip
 * @param {array} fileTypes files types to include in zip
 * @param {string} token token for authentication
 */
export const downloadPackage = async ( title, files, token, fileTypes = [] ) => {
  let response = 'success';

  const { publicRuntimeConfig } = getConfig();
  const zipEndpoint = `${publicRuntimeConfig.REACT_APP_PUBLIC_API}/v1/task/zip`;
  const file = files[0];
  const folder = file?.url?.substring(
    file.url.indexOf( 'daily_guidance' ),
    file.url.lastIndexOf( '/' )
  );

  if ( folder ) {
    const result = await fetch( zipEndpoint, {
      method: 'POST',
      body: JSON.stringify( {
        title,
        folder,
        fileTypes,
      } ),
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
      },
    } );

    if ( result.status === 200 ) {
      try {
        const blob = await result.blob();
        const url = window.URL.createObjectURL( blob );
        const a = document.createElement( 'a' );

        a.href = url;
        a.download = `${title || 'Package'}.zip`;
        document.body.appendChild( a );
        a.click();
        document.body.removeChild( a );
      } catch ( err ) {
        response = `Unable to process fetch response ${err.toString()}`;
      }
    } else {
      response = 'Unauthorized';
    }
  }

  return Promise.resolve( response );
};

/**
 * Return a string of taxonomy names for display
 * Receives a taxonomy array, default locale lang of english
 * @param array
 * @param locale
 * @returns {string}
 */
export const getLangTaxonomies = ( array, locale = 'en-us' ) => {
  if ( !Array.isArray( array ) || !array.length ) return '';

  return (
    array.map( tax => tax.translations
      .find( translation => translation.language.locale === locale )
      .name ).join( ', ' )
  );
};

export const getTransformedLangTaxArray = ( taxonomy = [], locale = 'en-us' ) => {
  if ( !Array.isArray( taxonomy ) || !taxonomy.length ) return [];

  return taxonomy.reduce( ( acc, tax ) => {
    const langTax = tax?.translations ? tax.translations.find( t => t.language.locale === locale ) : [];

    if ( getCount( langTax ) && tax.id ) {
      acc.push( { id: tax.id, name: langTax.name } );
    }

    return acc;
  }, [] );
};

export const getPreviewNotificationStyles = () => ( {
  position: 'absolute',
  top: '0',
  left: '0',
  right: '0',
  // match Semantic UI border-radius
  // borderTopLeftRadius: '0.28571429rem',
  // borderTopRightRadius: '0.28571429rem',
  padding: '1em 1.5em',
  fontSize: '1em',
  backgroundColor: '#fdb81e',
} );

/**
 * ReactMarkdown astPlugin for document conversion
 * disallow <script></script> tags
 * @param array
 * @param locale
 * @returns {function}
 */
export const parseHtml = htmlParser( {
  isValidNode: node => node.type !== 'script',
} );

/**
 * Suppresses React's act warning in unit tests
 * @param {*} consoleError
 */
export const suppressActWarning = consoleError => {
  const actMsg = 'Warning: An update to %s inside a test was not wrapped in act';

  jest.spyOn( console, 'error' ).mockImplementation( ( ...args ) => {
    if ( !args[0].includes( actMsg ) ) {
      consoleError( ...args );
    }
  } );
};
