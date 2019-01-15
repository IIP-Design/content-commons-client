import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-boost';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const createClient = ( { headers } ) => new ApolloClient( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  request: operation => {
    operation.setContext( {
      fetchOptions: {
        credentials: 'include',
      },
      headers
    } );
  }
} );


// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
