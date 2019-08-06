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
let APOLLO_SUBSCRIPTION_ENDPOINT = 'ws://localhost:4000/subscription';
const regResult = publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT.match( /https?:\/\/([^/]+)\// );
if ( regResult ) {
  const ssl = publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT.startsWith( 'https' );
  APOLLO_SUBSCRIPTION_ENDPOINT = `${ssl ? 'wss' : 'ws'}://${regResult[1]}/subscription`;
}
const request = async ( headers, operation ) => {
  operation.setContext( {
    headers
  } );
};

const getWsLink = () => {
  const client = new SubscriptionClient( APOLLO_SUBSCRIPTION_ENDPOINT, {
    reconnect: true,
    lazy: true
  } );

  const _wsLink = new WebSocketLink( client );

  // fixes the intial disconnection issue
  _wsLink.subscriptionClient.maxConnectTimeGenerator.duration = () => _wsLink.subscriptionClient.maxConnectTimeGenerator.max;
  return _wsLink;
};

// if you instantiate on the server, the error will be thrown
const wsLink = process.browser ? getWsLink() : null;

const httpLink = new HttpLink( {
  uri: publicRuntimeConfig.REACT_APP_APOLLO_ENDPOINT,
  credentials: 'include'
} );


const link = process.browser ? split( // only create the split in the browser
  // split based on operation type
  ( { query } ) => {
    const { kind, operation } = getMainDefinition( query );
    return kind === 'OperationDefinition' && operation === 'subscription';
  },
  wsLink,
  httpLink,
) : httpLink;

const createClient = ( { headers } ) => new ApolloClient( {
  link: ApolloLink.from( [
    onError( ( { graphQLErrors, networkError } ) => {
      if ( process.env.NODE_ENV === 'development' ) {
        if ( graphQLErrors ) {
          // sendToLoggingService( graphQLErrors );
          graphQLErrors.map( ( { message, locations, path } ) => console.log(
            `[GraphQL error]: Message: ${message}, Location: ${locations}, Path: ${path}`,
          ), );
        }
        if ( networkError ) {
          // take another action if we have a network error?
          console.log( `[Network error]: ${networkError}` );
        }
      }
    } ),

    new ApolloLink( ( operation, forward ) => new Observable( observer => {
      let handle;
      Promise.resolve( operation )
        .then( oper => request( headers, oper ) )
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
    } ) ),

    link
  ] ),

  cache: new InMemoryCache()
} );

// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
