import React, { useState } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import {
  CLOUDFLARE_SIGNIN_MUTATION,
  USER_SIGN_OUT_MUTATION,
  CURRENT_USER_QUERY
} from 'lib/graphql/queries/user';
import { useRouter } from 'next/router';
import { redirectTo, isDevEnvironment } from 'lib/browser';
import { isRestrictedPage } from 'lib/authentication';
import cookie from 'js-cookie';
import cookies from 'next-cookies';

const AuthContext = React.createContext();
const allowedRolesForRestrictedPages = ['EDITOR', 'TEAM_ADMIN', 'ADMIN'];

/**
 * Check user page permissions
 * Exported to make avaiale for SSR
 * @param {object} user graphQL user
 */
export const hasPagePermissions = user => user.permissions.some( permission => allowedRolesForRestrictedPages.includes( permission ) );

/**
 * Return the cookie that CloudFlare sets upon successful sign in to
 * @param {*} ctx next.js context object
 */
const getCloudFlareToken = ctx => {
  // CloudFlare is not connected to the dev environment
  // so send replacement
  if ( isDevEnvironment() ) {
    return 'cfToken';
  }

  /* eslint-disable camelcase */
  const { CF_Authorization } = cookies( ctx );
  return CF_Authorization;
  /* eslint-enable */
};

/**
 * Returns a user if both qa CloudFlare token AND
 * valid user exist, else return null
 * Exported to make avaiale for SSR
 * @param {obj} ctx next.js context object
 */
export const fetchUser = async ctx => {
  const cfAuth = getCloudFlareToken( ctx );

  // CloudFlare token MUST be available, if not return null
  if ( !cfAuth ) {
    return null;
  }

  try {
    const {
      data: { user }
    } = await ctx.apolloClient.query( { query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' } );
    if ( user ) {
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
 * Exported to make avaiale for SSR
 * @param {*} ctx ext.js context object
 */
export const canAccessPage = async ctx => {
  // are we on a page that requires permissions?
  if ( isRestrictedPage( ctx.pathname ) ) {
    const user = await fetchUser( ctx );

    // ensure a user and a user with proper permissions
    if ( !user || !hasPagePermissions( user ) ) {
      return false;
    }
  }
  return true;
};


function AuthProvider( props ) {
  const client = useApolloClient();
  const router = useRouter();

  // ensure signIn only called once
  const [attemptToSignIntoCF, setAttemptToSignIntoCF] = useState( false );


  // Attempt to fetch user
  const { data, loading: userLoading } = useQuery( CURRENT_USER_QUERY, {
    ssr: false,
    fetchPolicy: 'network-only'
  } );


  // Sign in mutation
  const [signIn, { loading: signInLoading, error: signInError }] = useMutation(
    CLOUDFLARE_SIGNIN_MUTATION, {
      refetchQueries: [{ query: CURRENT_USER_QUERY }]
    }
  );

  // Sign out mutation
  const [signOut] = useMutation( USER_SIGN_OUT_MUTATION, {
    onCompleted: () => {
      setAttemptToSignIntoCF( false );
      client.resetStore();

      // sign out of CF
      const {
        location: { protocol, hostname, port }
      } = window;
      const url = `${protocol}//${hostname}:${port}`;
      window.location = `https://america.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${url}`;
      cookie.remove( 'CF_Authorization' );
      cookie.remove( 'ES_TOKEN' );
      router.push( '/' );
    }
  } );


  const login = async () => {
    // do we have a CloudFlare token?
    const cfAuth = cookie.get( 'CF_Authorization' );
    if ( cfAuth ) {
      // ensure signIn only called once
      if ( !attemptToSignIntoCF ) {
        signIn( { variables: { token: cfAuth } } ).catch( err => console.dir( signInError ) );
        setAttemptToSignIntoCF( true );
      }

      if ( signInLoading ) {
        // console.log( 'Signing in' );
      }

      if ( signInError ) {
        // console.log( 'There was an error' )
      }

      redirectTo( '/', {} );
    }
  };


  const logout = async () => signOut();
  const register = () => console.log( 'register' );

  return (
    <AuthContext.Provider
      value={ {
        user: data?.user,
        loading: userLoading,
        login,
        logout,
        register
      } }
      { ...props }
    />
  );
}


function useAuth() {
  const context = React.useContext( AuthContext );
  if ( context === undefined ) {
    throw new Error( `useAuth must be used within a AuthProvider` );
  }
  return context;
}

export { AuthProvider, useAuth };
