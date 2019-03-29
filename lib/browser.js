import Router from 'next/router';

/*
 * This detection method identifies Internet Explorers up until version 11.
 *
 * Reference: https://msdn.microsoft.com/en-us/library/ms537503(v=vs.85).aspx
 */
export const isInternetExplorerBefore = version => {
  const iematch = /MSIE ([0-9]+)/g.exec( window.navigator.userAgent );

  return iematch ? +iematch[1] < version : false;
};

// TODO: isMobile does not work with ssr
export const isMobile = () => {};
// export const isMobile = () => {
//   const re = /(iPhone|iPod|iPad|Android|webOS|BlackBerry|IEMobile|Windows Phone|Opera Mini)/i;
//   return re.test( navigator.userAgent );
// };

/**
 * Returns boolean if size param <= window outer width
 * @param {number} size width to check window outer width against
 * @return {boolean} boolean if <= than size param
 */
export const isWindowWidthLessThanOrEqualTo = size => window.outerWidth <= size;

/**
 * Updates a url without reloading the page.  Uses replaceState to replace
 * the hostroy object instead of adding a new item to history
 *
 * @param {string} url new location
 */
export const updateUrl = url => {
  // window.history.replaceState( {}, '', url );
};

export const parseQueryString = source => {
  const map = {};

  if ( source === '' ) {
    return;
  }

  let groups = source;

  if ( groups.indexOf( '?' ) === 0 ) {
    groups = groups.substr( 1 );
  }
  groups = groups.split( '&' );

  groups.forEach( group => {
    const pairs = group.split(
      '=',
      // For: xxx=, Prevents: [xxx, ""], Forces: [xxx]
      ( group.slice( -1 ) !== '=' ) + 1
    );
    const [key, value] = pairs;
    if ( key ) {
      map[decodeURIComponent( key )] = typeof value === 'undefined' ? value : decodeURIComponent( value );
    }
  } );

  return map;
};

export const stringifyQueryString = obj => Object.keys( obj )
  .map( k => `${encodeURIComponent( k )}=${encodeURIComponent( obj[k] )}` )
  .join( '&' );

/**
 *
 * @param {*} url url to navigate to
 * @param {*} params window config properties
 */
export const openWindow = ( url, { name = '', height = 400, width = 600 } ) => {
  /* eslint-disable no-mixed-operators */
  const left = window.outerWidth / 2 + ( window.screenX || window.screenLeft || 0 ) - width / 2;
  const top = window.outerHeight / 2 + ( window.screenY || window.screenTop || 0 ) - height / 2;
  /* eslint-enable no-mixed-operators */

  const config = {
    height,
    width,
    left,
    top,
    location: 'no',
    toolbar: 'no',
    status: 'no',
    directories: 'no',
    menubar: 'no',
    scrollbars: 'yes',
    resizable: 'no',
    centerscreen: 'yes',
    chrome: 'yes'
  };

  window.open(
    url,
    isInternetExplorerBefore( 10 ) ? '' : name,
    Object.keys( config )
      .map( key => `${key}=${config[key]}` )
      .join( ', ' )
  );
};


/**
 * Redirect to another based for both server and client redirects
 * @param {string} destination page to redirect to
 * @param {object} : { res, status } response object from server, status code to use
 */
export const redirectTo = ( destination, { res, status } ) => {
  if ( res ) {
    res.writeHead( status || 302, {
      Location: destination
    } );
    res.end();
  } else {
    Router.push( destination );
  }
};
