import { ApolloClient } from 'apollo-client';
import { InMemoryCache } from 'apollo-cache-inmemory';
import { HttpLink } from 'apollo-link-http';
import { WebSocketLink } from 'apollo-link-ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { onError } from 'apollo-link-error';
import { ApolloLink, Observable, split } from 'apollo-link';
import { getMainDefinition } from 'apollo-utilities';
import withApollo from 'next-with-apollo';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const request = async ( headers, operation ) => {
  operation.setContext( {
    headers
  } );
};

// Links are designed to be composed together to form control flow chains
// to manage a GraphQL operation request.

// Web socket link (currently disabled)
// This link is particularly useful to use GraphQL Subscriptions,
// but it will also allow you to send GraphQL queries and mutations over WebSockets as well.
const getWsLink = () => {
  const client = new SubscriptionClient( publicRuntimeConfig.REACT_APP_APOLLO_SUBSCRIPTIONS_ENDPOINT, {
    reconnect: true,
    lazy: true
  } );

  const _wsLink = new WebSocketLink( client );

  // fixes the intial disconnection issue
  _wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () => _wsLink.subscriptionClient.maxConnectTimeGenerator.max;
  return _wsLink;
};

// Only generate on the clients as if you instantiate on the server, the error will be thrown
const wsLink = process.browser ? getWsLink() : null;

// Apollo Link that sends HTTP requests.
const httpLink = new HttpLink( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  credentials: 'include' // send any logged in browser cookies w/each request
} );

// Default error handler
const errorLink = onError( ( { graphQLErrors, networkError } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    if ( graphQLErrors ) {
      // sendToLoggingService( graphQLErrors );
      graphQLErrors.map( ( { message, locations, path } ) => console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ), );
    }
    if ( networkError ) {
      // take another action if we have a network error?
      console.log( '[Network error]' );
      console.dir( networkError );
    }
  }
} );

// only create the split in the browser
/* eslint-disable no-unused-vars */
const link = process.browser ? split(
  // split based on operation type
  ( { query } ) => {
    const { kind, operation } = getMainDefinition( query );
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
) : httpLink;


const createClient = ( { headers, initialState } ) => new ApolloClient( {
  link: ApolloLink.from( [
    errorLink,

    new ApolloLink(
      ( operation, forward ) => new Observable( observer => {
        let handle;
        Promise.resolve( operation )
          .then( oper => request( headers, oper ) )
          .then( () => {
            handle = forward( operation ).subscribe( {
              next: observer.next.bind( observer ),
              error: observer.error.bind( observer ),
              complete: observer.complete.bind( observer )
            } );
          } )
          .catch( observer.error.bind( observer ) );

        return () => {
          if ( handle ) handle.unsubscribe();
        };
      } )
    ),

    httpLink // link  - disable web socket link for now
  ] ),

  cache: new InMemoryCache().restore( initialState || {} )
} );

// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
