/* eslint-disable import/no-unassigned-import */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
/* eslint-enable */

import { useEffect } from 'react';
import Amplify from 'aws-amplify';
import { ApolloProvider } from '@apollo/client';
import App from 'next/app';
import isEmpty from 'lodash/isEmpty';
import PropTypes from 'prop-types';

import Page from 'components/Page';

import { AuthProvider, canAccessPage } from 'context/authContext';
import awsconfig from '../aws-exports';
import storeWrapper from 'lib/redux/store';
import withApollo from 'hocs/withApollo';

import 'styles/styles.scss';

Amplify.configure( {
  ...awsconfig,
  ssr: true,
} );

const Commons = ( { apollo, Component, pageProps, router } ) => {
  const { redirect } = pageProps;

  useEffect( () => {
    if ( redirect ) {
      router.push( `/login?return=${redirect}` );
    }
  }, [redirect] );

  return (
    <ApolloProvider client={ apollo }>
      <AuthProvider>
        <Page redirect={ pageProps.redirect }>
          <Component { ...pageProps } />
        </Page>
      </AuthProvider>
    </ApolloProvider>
  );
};

Commons.getInitialProps = async appContext => {
  // calls page's `getInitialProps` and fills `appProps.pageProps`
  const appProps = await App.getInitialProps( appContext );

  const { ctx } = appContext;

  // if user does not have appropriate page permissions redirect
  if ( !await canAccessPage( ctx ) ) {
    // only set redirect url to a non login url
    if ( ctx.pathname !== '/login' ) {
      // add redirect url as a query param
      // cannot use client side storage or libraries as this is executing on the server
      appProps.pageProps.redirect = ctx.asPath;
    }
  }

  // exposes apollo query to component
  if ( !isEmpty( ctx.query ) ) {
    appProps.pageProps.query = ctx.query;
  }

  return { ...appProps };
};

Commons.propTypes = {
  apollo: PropTypes.object,
  Component: PropTypes.oneOfType( [
    PropTypes.func,
    PropTypes.object,
  ] ),
  pageProps: PropTypes.object,
  router: PropTypes.object,
};

export default withApollo( storeWrapper.withRedux( Commons ) );
