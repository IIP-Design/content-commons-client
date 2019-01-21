import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

// TODO: Add more robsut error info
const onErrorDev = ( ( { networkError, graphQLErrors } ) => {
  if ( graphQLErrors ) console.log( 'graphQLErrors', graphQLErrors );
  if ( networkError ) console.log( 'networkError', networkError );
} );

// Turn off default Apollo console.log errors
const onErrorProd = ( () => {} );

const createClient = ( { headers } ) => new ApolloClient( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  request: operation => {
    operation.setContext( {
      fetchOptions: {
        credentials: 'include',
      },
      headers
    } );
  },

  onError: ( process.env.NODE_ENV === 'development' ) ? onErrorDev : onErrorProd
} );


// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
