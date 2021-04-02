/* eslint-disable import/no-unassigned-import */
import 'core-js/stable';
import 'regenerator-runtime/runtime';
/* eslint-enable */

import Amplify from 'aws-amplify';
import { ApolloProvider } from '@apollo/client';
import App from 'next/app';
import isEmpty from 'lodash/isEmpty';

import Page from 'components/Page';

import { AuthProvider, canAccessPage } from 'context/authContext';
import awsconfig from '../aws-exports';
import { redirectTo } from 'lib/browser';
import storeWrapper from 'lib/redux/store';
import withApollo from 'hocs/withApollo';

import 'styles/styles.scss';

Amplify.configure( {
  ...awsconfig,
  ssr: true,
} );

class Commons extends App {
  static getStaticProps = async ( { Component, ctx } ) => {
    // if user does not have appropriate page permissions redirect
    if ( !await canAccessPage( ctx ) ) {
      // only set redirect url to a non login url
      if ( ctx.pathname !== '/login' ) {
        // add redirect url as a query param
        // cannot use client side storage or libraries as this is executing on the server
        redirectTo( `/login?return=${ctx.asPath}`, ctx );
      }
    }

    const pageProps = Component.getInitialProps ? await Component.getInitialProps( ctx ) : {};

    // exposes apollo query to component
    if ( !isEmpty( ctx.query ) ) {
      pageProps.query = ctx.query;
    }

    if ( Object.keys( pageProps ).length > 0 ) {
      return { pageProps };
    }

    return {};
  }

  render() {
    const {
      Component, apollo, pageProps,
    } = this.props;

    return (
      <ApolloProvider client={ apollo }>
        <AuthProvider>
          <Page>
            <Component { ...pageProps } />
          </Page>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo( storeWrapper.withRedux( Commons ) );
