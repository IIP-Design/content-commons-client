import '@babel/polyfill';
import App from 'next/app';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { AuthProvider, canAccessPage } from 'context/authContext';
import { redirectTo } from 'lib/browser';
import withRedux from 'next-redux-wrapper';
import isEmpty from 'lodash/isEmpty';
import withApollo from 'hocs/withApollo';
import Page from 'components/Page';
import makeStore from 'lib/redux/store';
import 'styles/styles.scss';

class Commons extends App {
  static async getInitialProps( { Component, ctx } ) {
    let pageProps = {};

    // if user does not have appropriatepage permissions redirect
    if ( !( await canAccessPage( ctx ) ) ) {
      redirectTo( '/login', { res: ctx.res } );
    }

    if ( Component.getInitialProps ) {
      pageProps = await Component.getInitialProps( ctx );
    }

    // exposes apollo query to component
    if ( !isEmpty( ctx.query ) ) {
      pageProps.query = ctx.query;
    }

    return { pageProps };
  }

  render() {
    const {
      Component, apollo, store, pageProps
    } = this.props;

    return (
      <ApolloProvider client={ apollo }>
        <AuthProvider>
          <Provider store={ store }>
            <Page>
              <Component { ...pageProps } />
            </Page>
          </Provider>
        </AuthProvider>
      </ApolloProvider>
    );
  }
}

export default withApollo( withRedux( makeStore )( Commons ) );
