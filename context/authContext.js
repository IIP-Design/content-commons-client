import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useApolloClient } from '@apollo/react-hooks';
import {
  CLOUDFLARE_SIGNIN_MUTATION,
  USER_SIGN_OUT_MUTATION,
  CURRENT_USER_QUERY
} from 'lib/graphql/queries/user';
import { useRouter } from 'next/router';
import { redirectTo, isDevEnvironment } from 'lib/browser';
import { isRestrictedPage, hasPermissionsToAccessPage } from 'lib/authentication';
import { Loader } from 'semantic-ui-react';
import cookie from 'js-cookie';


const AuthContext = React.createContext();

function AuthProvider( props ) {
  const client = useApolloClient();
  const router = useRouter();
  const [attemptToSignIntoCF, setAttemptToSignIntoCF] = useState(
    false
  );
  const [user, setUser] = useState( null );

  // Attempt to fetch user
  const { data, loading: userLoading, error: userError } = useQuery(
    CURRENT_USER_QUERY,
    {
      ssr: false
    }
  );

  // Sign in mutation
  const [
    signIn,
    { data: signInData, loading: signInLoading, error: signInError }
  ] = useMutation( CLOUDFLARE_SIGNIN_MUTATION );

  // Sign out mutation
  const [signOut] = useMutation( USER_SIGN_OUT_MUTATION, {
    onCompleted: () => {
      setAttemptToSignIntoCF( false );
      client.resetStore();
      setUser( null );

      // sign out of CF
      const {
        location: { protocol, hostname, port }
      } = window;
      const url = `${protocol}//${hostname}:${port}`;
      window.location = `https://america.cloudflareaccess.com/cdn-cgi/access/logout?returnTo=${url}`;
    }
  } );

  const reDirect = _user => {
    if ( isRestrictedPage( router.pathname ) ) {
      // if restricted page, redirect if user does not have neccessary permissions
      if ( _user && !hasPermissionsToAccessPage( _user?.permissions ) ) {
        redirectTo( '/', {} );
      }
    } else {
      // Send to home after login if not restricted
      redirectTo( '/', {} );
    }
  };

  // User can either be set on inital load when CURRENT_USER_QUERY query returns
  // OR when user clicks the "login" button and executes the CLOUDFLARE_SIGNIN_MUTATION
  useEffect( () => {
    if ( data?.user ) {
      setUser( data.user );
    } else if ( signInData?.cloudflareSignin ) {
      setUser( signInData.cloudflareSignin );
    }
  }, [data, signInData] );

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

      // if we have successful sign in, redirect
      if ( signInData?.cloudflareSignin ) {
        reDirect( signInData.cloudflareSignin );
      }
    }
  };

  if ( userLoading ) {
    return (
      <Loader size="medium" active>
                                       Loading
      </Loader>
    );
  }

  if ( userError ) {
    return <div>Error</div>;
  }

  if ( !data.user ) {
    // Attempt to log user in if we do not have a vaild user
    // and user is attempting to access a restricted page
    if ( isRestrictedPage( router.pathname ) ) {
      login();
    }
  }

  const logout = async () => signOut();
  const register = () => console.log( 'register' );

  return (
    <AuthContext.Provider
      value={ {
        user,
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
