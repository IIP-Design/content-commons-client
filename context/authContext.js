import React, { useState, useEffect } from 'react';
import cookie from 'js-cookie';
import cookies from 'next-cookies';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';
import { Auth, Hub } from 'aws-amplify';

import {
  COGNITO_SIGNIN_MUTATION,
  USER_SIGN_OUT_MUTATION,
  CURRENT_USER_QUERY,
} from 'lib/graphql/queries/user';
import { isRestrictedPage } from 'lib/authentication';

const AuthContext = React.createContext();
const allowedRolesForRestrictedPages = [
  'EDITOR', 'TEAM_ADMIN', 'ADMIN',
];

/**
 * Check user page permissions
 * Exported to make available for SSR
 * @param {object} user graphQL user
 */
export const hasPagePermissions = user => user.permissions.some(
  permission => allowedRolesForRestrictedPages.includes( permission ),
);


/**
 * Returns a user if valid user exist, else return null
 * Exported to make available for SSR and outside
 * of react components
 * NOTE: Do we need a valid cognito session here?
 * @param {obj} ctx next.js context object
 */
export const fetchUser = async ctx => {
  try {
    // do we have a valid session?
    const {
      data: { user },
    } = await ctx.apolloClient.query( { query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' } );

    if ( user && user.id !== 'public' ) {
      // add token to authenticate to elastic api to user
      const { ES_TOKEN } = cookies( ctx );

      return { ...user, esToken: ES_TOKEN };
    }

    return null;
  } catch ( err ) {
    return null;
  }
};

/**
 * Checks to see if on a protected page and if so
 * verify a logged user with applicable permissions
 * Exported to make available for SSR
 * @param {*} ctx next.js context object
 */
export const canAccessPage = async ctx => {
  // are we on a page that requires permissions?
  if ( isRestrictedPage( ctx ) ) {
    const user = await fetchUser( ctx );

    // No valid user, return
    if ( !user ) {
      return false;
    }

    // if on publisher pages, verify publisher permissions
    if ( ctx?.pathname?.startsWith( '/admin' ) ) {
      if ( !hasPagePermissions( user ) ) {
        return false;
      }
    }

    // assume a subscriber since user exists (subscriber is the base permission level)
    return true;
  }

  return true;
};


const AuthProvider = props => {
  const [authenticatedUser, setAuthenticatedUser] = useState( null );
  const client = useApolloClient();
  const router = useRouter();

  // Sign in mutation
  const [signIn] = useMutation( COGNITO_SIGNIN_MUTATION, {
    refetchQueries: [{ query: CURRENT_USER_QUERY }],
    onCompleted: () => {
      console.log( 'commons sign in complete' );
    },
  } );

  // Sign out mutation
  const [signOut] = useMutation( USER_SIGN_OUT_MUTATION, {
    onCompleted: async () => {
      client.resetStore();
      setAuthenticatedUser( null );

      // sign out of Cognito
      await Auth.signOut();

      // Remove elastic api access token
      cookie.remove( 'ES_TOKEN' );
      router.push( '/' );
    },
  } );

  /**
   * Sign In mutation. Send cognito idToken
   * @param {Object} session Cognito session
   */
  const login = async session => {
    // Get jwt token from Cognito session
    const token = session?.idToken?.jwtToken;

    // Send cognito token for verification on commons server
    signIn( { variables: { token } } ).catch( err => {} );
  };

  /*
   Login is initiated from the Login screen via Auth.federatedSignIn()
   We listen for a successful signin event and then initiate Commons login,
   passing Cognito token. If a redirect is provided, i.e. an unauthenticated user
   attempts to access a protected page, they must 1st signin before being directed
   to original protected page. The redirect is added to the
   Auth.federatedSignIn( { provider: 'Google', customState: redirect }) method and
   listened for via the 'customOAuthState' event.
   */
  useEffect( () => {
    Hub.listen( 'auth', ( { payload: { event, data: _data } } ) => {
      if ( event === 'signIn' ) {
        console.log( 'Sign in event from Hub' );
        console.dir( _data );
        login( _data?.signInUserSession );
      }
      if ( event === 'customOAuthState' ) {
        console.log( 'customOAuthState event from Hub' );
        console.dir( _data );
        router.push( _data );
      }
    } );
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [] );

  // Attempt to fetch user
  const { data, loading: userLoading } = useQuery(
    CURRENT_USER_QUERY, {
      ssr: false,
      fetchPolicy: 'network-only',
    },
  );

  useEffect( () => {
    if ( data?.user ) {
      const _authenticatedUser = data.user;

      if ( _authenticatedUser.id !== 'public' ) _authenticatedUser.esToken = cookie.get( 'ES_TOKEN' );
      setAuthenticatedUser( data.user );
    }
  }, [data] );

  const logout = async () => signOut();
  const register = () => {};

  return (
    <AuthContext.Provider
      value={ {
        user: authenticatedUser,
        loading: userLoading,
        login,
        logout,
        register,
      } }
      { ...props }
    />
  );
};


function useAuth() {
  const context = React.useContext( AuthContext );

  if ( context === undefined ) {
    throw new Error( 'useAuth must be used within a AuthProvider' );
  }

  return context;
}

export { AuthProvider, useAuth };
