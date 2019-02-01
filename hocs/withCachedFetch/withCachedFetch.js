import React, { Component } from 'react';
import PropTypes from 'prop-types';
import cachedFetch, { overrideCache } from '../../lib/cachedFetch';

/**
 * Fetches markdown from either the cache (sessionStorage) or via
 * an external url and sets it as a property on wrapped component
 *
 * @param {React component} WrappedComponent
 * @param {string} url
 */
const withCachedFetch = ( WrappedComponent, url ) => {
  class HOC extends Component {
    static async getInitialProps( ctx ) {
      const res = await cachedFetch( url );
      const isServerRendered = !!ctx.req;

      return { data: res.data, isServerRendered, error: res.error };
    }

    componentDidMount() {
      const { data, isServerRendered, error } = this.props;

      // When the page is server-rendered, we override the value
      // in the client cache if data call was successful
      if ( isServerRendered && !error ) {
        overrideCache( url, data );
      }
    }

    render() {
      return (
        <WrappedComponent
          { ...this.props }
        />
      );
    }
  }

  HOC.propTypes = {
    data: PropTypes.string,
    isServerRendered: PropTypes.bool,
    error: PropTypes.oneOfType( [PropTypes.number, PropTypes.bool] )
  };


  return HOC;
};


export default withCachedFetch;
