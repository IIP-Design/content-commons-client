import withApollo from 'next-with-apollo';
import ApolloClient from 'apollo-client';
import getConfig from 'next/config';
import { WebSocketLink } from 'apollo-link-ws';
import { HttpLink } from 'apollo-link-http';
import { split, ApolloLink, Observable } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import { onError } from 'apollo-link-error';
import { InMemoryCache } from 'apollo-cache-inmemory';

const { publicRuntimeConfig } = getConfig();

// TODO: Add more robsut error info
const onErrorDev = ( ( { networkError, graphQLErrors } ) => {
  if ( graphQLErrors ) console.log( 'graphQLErrors', graphQLErrors );
  if ( networkError ) console.log( 'networkError', networkError );
} );

// Turn off default Apollo console.log errors
const onErrorProd = ( () => {} );


// Setup the network "links"
const wsLink = () => new WebSocketLink( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_SUBSCRIPTION,
  options: {
    reconnect: true
  }
} );

const httpLink = headers => new HttpLink( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  fetch,
  fetchOptions: {},
  credentials: 'same-origin',
  headers: headers || {},
} );


const link = headers => split(
  // split based on operation type
  ( { query } ) => {
    const { kind, operation } = getMainDefinition( query );
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink(),
  httpLink( headers ),
);

const request = headers => operation => {
  operation.setContext( {
    fetchOptions: {
      credentials: 'include',
    },
    headers
  } );
};

const requestHandler = headers => new ApolloLink(
  ( operation, forward ) => new Observable( observer => {
    let handle;
    Promise.resolve( operation )
      .then( oper => request( headers )( oper ) )
      .then( () => {
        handle = forward( operation ).subscribe( {
          next: observer.next.bind( observer ),
          error: observer.error.bind( observer ),
          complete: observer.complete.bind( observer ),
        } );
      } )
      .catch( observer.error.bind( observer ) );

    return () => {
      if ( handle ) {
        handle.unsubscribe();
      }
    };
  } ),
);

const createClient = ( { headers } ) => {
  const transports = [
    onError( onErrorDev ),
    requestHandler( headers )
  ];
  if ( process.browser ) {
    transports.push( link( headers ) );
  } else {
    transports.push( httpLink( headers ) );
  }

  return new ApolloClient( {
    link: ApolloLink.from( transports ),
    cache: new InMemoryCache()
  } );
};


// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
