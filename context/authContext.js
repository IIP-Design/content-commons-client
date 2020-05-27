import React, { useState } from 'react';
import cookie from 'js-cookie';
import cookies from 'next-cookies';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import { useRouter } from 'next/router';

import {
  CLOUDFLARE_SIGNIN_MUTATION,
  USER_SIGN_OUT_MUTATION,
  CURRENT_USER_QUERY,
} from 'lib/graphql/queries/user';
import { isDevEnvironment } from 'lib/browser';
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
 * Returns a user if both a CloudFlare token AND
 * valid user exist, else return null
 * Exported to make available for SSR and outside
 * of react components
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
  const client = useApolloClient();
  const router = useRouter();

  // ensure signIn only called once
  const [attemptToSignIntoCF, setAttemptToSignIntoCF] = useState( false );

  // Attempt to fetch user
  const { data, loading: userLoading } = useQuery( CURRENT_USER_QUERY, {
    ssr: false,
    fetchPolicy: 'network-only',
  } );

  // Sign in mutation
  const [signIn] = useMutation(
    CLOUDFLARE_SIGNIN_MUTATION, {
      refetchQueries: [{ query: CURRENT_USER_QUERY }],
    },
  );

  // Sign out mutation
  const [signOut] = useMutation( USER_SIGN_OUT_MUTATION, {
    onCompleted: () => {
      setAttemptToSignIntoCF( false );
      client.resetStore();

      // sign out of CF
      const {
        location: { protocol, hostname, port },
      } = window;

      // Only do CloudFlare logout if on staging, beta or prod
      if ( !isDevEnvironment() ) {
        const url = `${protocol}//${hostname}:${port}`;

        window.location = `https://america.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${url}`;
      }
      cookie.remove( 'CF_Authorization' );
      cookie.remove( 'ES_TOKEN' );
      router.push( '/' );
    },
  } );


  const login = async () => {
    // do we have a CloudFlare token?
    const cfAuth = cookie.get( 'CF_Authorization' );

    if ( cfAuth ) {
      // ensure signIn only called once
      if ( !attemptToSignIntoCF ) {
        signIn( { variables: { token: cfAuth } } ).catch( err => {} );
        setAttemptToSignIntoCF( true );
      }
    }
  };

  const logout = async () => signOut();
  const register = () => {};

  if ( data?.user && data.user.id !== 'public' ) {
    data.user.esToken = cookie.get( 'ES_TOKEN' );
  }

  return (
    <AuthContext.Provider
      value={ {
        user: data?.user,
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
