/* eslint-disable no-console */
import { ApolloClient, ApolloLink, HttpLink, InMemoryCache, Observable, split } from '@apollo/client';
import { WebSocketLink } from '@apollo/client/link/ws';
import { SubscriptionClient } from 'subscriptions-transport-ws';
import { onError } from '@apollo/client/link/error';
import { getMainDefinition } from '@apollo/client/utilities';
import { getDataFromTree } from '@apollo/client/react/ssr';
import withApollo from 'next-with-apollo';
import getConfig from 'next/config';

const { publicRuntimeConfig } = getConfig();

const request = async ( headers, operation ) => {
  operation.setContext( {
    headers,
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
    lazy: true,
  } );

  const _wsLink = new WebSocketLink( client );

  // fixes the initial disconnection issue
  // eslint-disable-next-line max-len
  _wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () => _wsLink.subscriptionClient.maxConnectTimeGenerator.max;

  return _wsLink;
};

// Only generate on the clients as if you instantiate on the server, the error will be thrown
const wsLink = process.browser ? getWsLink() : null;

// Apollo Link that sends HTTP requests.
const httpLink = new HttpLink( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  credentials: 'include', // send any logged in browser cookies w/each request
} );

// Default error handler
const errorLink = onError( ( { graphQLErrors, networkError } ) => {
  if ( process.env.NODE_ENV === 'development' ) {
    if ( graphQLErrors ) {
      // sendToLoggingService( graphQLErrors );
      graphQLErrors.map( ( { message, locations, path } ) => console.log(
        `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
      ) );
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
const link = process.browser
  ? split(
    // split based on operation type
    ( { query } ) => {
      const { kind, operation } = getMainDefinition( query );

      return kind === 'OperationDefinition' && operation === 'subscription';
    },
    wsLink,
    httpLink,
  )
  : httpLink;


const createClient = ( { headers, initialState } ) => new ApolloClient( {
  link: ApolloLink.from( [
    errorLink,

    new ApolloLink(
      ( operation, forward ) => new Observable( observer => {
        let handle;

        Promise.resolve( operation )
          .then( op => request( headers, op ) )
          .then( () => {
            handle = forward( operation ).subscribe( {
              next: observer.next.bind( observer ),
              error: observer.error.bind( observer ),
              complete: observer.complete.bind( observer ),
            } );
          } )
          .catch( observer.error.bind( observer ) );

        return () => {
          if ( handle ) handle.unsubscribe();
        };
      } ),
    ),

    httpLink, // link  - disable web socket link for now
  ] ),

  cache: new InMemoryCache( {
    typePolicies: {
      Playbook: {
        fields: {
          supportFiles: {
            merge( existing, incoming, { readField, mergeObjects } ) {
              const merged = existing ? existing.slice( 0 ) : [];
              const fileToIndex = Object.create( null );

              if ( existing ) {
                existing.forEach( ( file, index ) => {
                  fileToIndex[readField( 'id', file )] = index;
                } );
              }

              incoming.forEach( file => {
                const id = readField( 'id', file );
                const index = fileToIndex[id];

                if ( typeof index === 'number' ) {
                  // Merge the new file data with the existing file data.
                  merged[index] = mergeObjects( merged[index], file );
                } else {
                  // First time we've seen this file in this array.
                  fileToIndex[id] = merged.length;
                  merged.push( file );
                }
              } );

              // If incoming file list is shorter than the merged file list we know files have been deleted and should not be returned
              return merged.length > incoming.length ? incoming : merged;
            },
          },
        },
      },
    },
  } ).restore( initialState || {} ),
  resolvers: {},
} );

// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree } );
