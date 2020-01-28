import '@babel/polyfill';
import App from 'next/app';
import Router from 'next/router';
import { ApolloProvider } from 'react-apollo';
import { Provider } from 'react-redux';
import { AuthProvider } from 'context/authContext';
import withRedux from 'next-redux-wrapper';
import isEmpty from 'lodash/isEmpty';
import withApollo from 'hocs/withApollo';
import Page from 'components/Page';
import makeStore from 'lib/redux/store';
import 'styles/styles.scss';

// This is a bit of a hack to ensure styles reload on client side route changes.
// See: https://github.com/zeit/next-plugins/issues/282#issuecomment-480740246
if ( process.env.NODE_ENV !== 'production' ) {
  Router.events.on( 'routeChangeComplete', () => {
    const path = '/_next/static/css/styles.chunk.css';
    const chunksSelector = `link[href*="${path}"]`;
    const chunksNodes = document.querySelectorAll( chunksSelector );
    const timestamp = new Date().valueOf();
    chunksNodes[0].href = `${path}?${timestamp}`;
  } );
}

class Commons extends App {
  static async getInitialProps( { Component, ctx } ) {
    let pageProps = {};

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
