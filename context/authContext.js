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

export const hasPagePermissions = user => user.permissions.some( permission => allowedRolesForRestrictedPages.includes( permission ) );

export const fetchUser = async apolloClient => {
  // const cfAuth = getCloudFlareToken( ctx );
  try {
    const { data: { user } } = await apolloClient.query( { query: CURRENT_USER_QUERY } );
    return user;
  } catch ( err ) {
    return null;
  }
};


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

export const canAccessPage = async ctx => {
  if ( isRestrictedPage( ctx.pathname ) ) {
    const cfAuth = getCloudFlareToken( ctx );
    const { data: { user } } = await ctx.apolloClient.query( { query: CURRENT_USER_QUERY } );
    if ( !cfAuth || !user || !hasPagePermissions( user ) ) {
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
