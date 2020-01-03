import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { redirectTo } from 'lib/browser';
import NotFound404 from 'components/errors/NotFound404/NotFound404';

class Error extends React.Component {
  static getInitialProps( { res, err, asPath } ) {
    // eslint-disable-next-line  no-nested-ternary
    const statusCode = res ? res.statusCode : err ? err.statusCode : null;

    /**
     * Addresses a longstanding Next bug (since v5, at least)
     * where a trailing slash, (e.g., `/admin/package/`) results
     * in 404. This is workaround until the bug is fixed.
     * @see https://github.com/zeit/next.js/issues/5214#issuecomment-564724632
     * @see https://github.com/zeit/next.js/pull/6421
     */
    if ( statusCode && statusCode === 404 ) {
      if ( asPath.match( /\/$/ ) ) {
        const withoutTrailingSlash = asPath.substr( 0, asPath.length - 1 );
        redirectTo( withoutTrailingSlash, { res } );
      }
    }

    return { statusCode };
  }

  renderServerError = statusCode => {
    if ( statusCode === 404 ) {
      return <NotFound404 />;
    }
    return <p>{ `An error ${statusCode} occurred on the server` }</p>;
  }

  renderClientError = () => <p> An error occurred on client</p>

  render() {
    const styleObj = {
      textAlign: 'center',
      margin: '180px auto 120px auto'
    };

    const { statusCode } = this.props;

    return (
      <section style={ styleObj }>
        <h1>Oops</h1>
        <h4 className="confirm_subtext">This usually isn't a common occurrence.</h4>
        { statusCode
          ? this.renderServerError( statusCode )
          : this.renderClientError() }
      </section>
    );
  }
}

Error.propTypes = {
  statusCode: PropTypes.number
};

export default withRouter( Error );
