import React from 'react';
import { useQuery, useMutation } from '@apollo/react-hooks';
import { CURRENT_USER_QUERY, USER_SIGN_OUT_MUTATION } from 'lib/graphql/queries/user';
import { useRouter } from 'next/router';
import { isRestrictedPage, hasPermissionsToAccessPage } from 'lib/authentication';
import { Loader } from 'semantic-ui-react';

const AuthContext = React.createContext();

function AuthProvider( props ) {
  const allowedRolesForRestrictedPages = ['EDITOR', 'TEAM_ADMIN', 'ADMIN'];
  const router = useRouter();

  const {
    client, loading, error, data
  } = useQuery( CURRENT_USER_QUERY, { ssr: false } );

  const [signOut] = useMutation( USER_SIGN_OUT_MUTATION, {
    onCompleted: () => {
      client.resetStore();
    }
  } );

  if ( loading ) {
    return (
      <Loader size="large" active>
        Loading
      </Loader>
    );
  }

  if ( error ) {
    // handle error -- redirect or show error
  }

  const user = data?.user;

  // Verify user has permissions to access page if page is restricted
  if ( isRestrictedPage( router.pathname ) ) {
    if ( !user || !hasPermissionsToAccessPage( user?.permissions, allowedRolesForRestrictedPages ) ) {
      // No user, send to login page
      if ( !user ) {
        router.push( '/login' );
      }
      // we have a user with in sufficient permissions; send to home
      router.push( '/' );
    }
  }

  const login = () => console.log( 'login' );
  const register = () => console.log( 'register' );
  const logout = async () => signOut();

  return (
    <AuthContext.Provider
      value={ {
        user, login, logout, register
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
