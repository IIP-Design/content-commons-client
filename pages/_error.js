import React, { useEffect } from 'react';
import propTypes from 'prop-types';
import { withRouter } from 'next/router';

import ErrorSection from 'components/errors/ErrorSection';

import { redirectTo } from 'lib/browser';

const Error = ( { statusCode, withoutTrailingSlash } ) => {
  useEffect( () => {
    if ( withoutTrailingSlash ) {
      redirectTo( withoutTrailingSlash );
    }
  }, [withoutTrailingSlash] );

  return (
    <ErrorSection statusCode={ statusCode } />
  );
};

Error.getInitialProps = async ( { asPath, res, err } ) => {
  // eslint-disable-next-line  no-nested-ternary
  const statusCode = res ? res.statusCode : err ? err.statusCode : null;
  let withoutTrailingSlash;

  /**
     * Addresses a longstanding Next bug (since v5, at least)
     * where a trailing slash, (e.g., `/admin/package/`) results
     * in 404. This is workaround until the bug is fixed.
     * @see https://github.com/zeit/next.js/issues/5214#issuecomment-564724632
     * @see https://github.com/zeit/next.js/pull/6421
     */
  if ( statusCode && statusCode === 404 ) {
    if ( asPath.match( /\/$/ ) ) {
      withoutTrailingSlash = asPath.substr( 0, asPath.length - 1 );
    }
  }

  return { statusCode, withoutTrailingSlash };
};

Error.propTypes = {
  statusCode: propTypes.number,
  withoutTrailingSlash: propTypes.string,
};

export default withRouter( Error );
