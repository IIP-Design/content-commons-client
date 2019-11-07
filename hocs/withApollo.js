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

import { UPDATED_PROJECTS_CACHE_QUERY } from 'lib/graphql/queries/client';

const { publicRuntimeConfig } = getConfig();

const request = async ( headers, operation ) => {
  operation.setContext( {
    headers
  } );
};

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

const cache = new InMemoryCache();

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
          console.log( '[Network error]' );
          console.dir( networkError );
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

  cache,

  resolvers: {
    Mutation: {
      addUpdatedProject: ( _, { id }, { client } ) => {
        const previous = client.readQuery( { query: UPDATED_PROJECTS_CACHE_QUERY } );
        if ( !previous.updatedProjects.includes( id ) ) {
          client.writeQuery( {
            query: UPDATED_PROJECTS_CACHE_QUERY,
            data: {
              updatedProjects: [...previous.updatedProjects, id]
            }
          } );
        }
        return null;
      },
      removeUpdatedProject: ( _, { id }, { client } ) => {
        const previous = client.readQuery( { query: UPDATED_PROJECTS_CACHE_QUERY } );
        const removeUpdatedProjectFromCache = previous.updatedProjects.filter( projectID => projectID !== id );
        client.writeQuery( {
          query: UPDATED_PROJECTS_CACHE_QUERY,
          data: {
            updatedProjects: [...removeUpdatedProjectFromCache]
          }
        } );
        return null;
      }
    }
  },

} );

cache.writeData( {
  data: {
    updatedProjects: [],
  }
} );

// Second argument: { getDataFromTree: 'ssr' } : should the apollo store be hydrated before the first render ?,
// allowed values are always, never or ssr (don't hydrate on client side navigation)
export default withApollo( createClient, { getDataFromTree: 'ssr' } );
