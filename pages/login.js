import React, { useState, useEffect } from 'react';
import { useAuth, fetchUser } from 'context/authContext';
import Login from 'components/Login/Login';
import { isDevEnvironment, redirectTo } from 'lib/browser';
import { Loader } from 'semantic-ui-react';

const LoginPage = () => {
  const { user, login } = useAuth();
  const [isDev, setIsDev] = useState( false );

  useEffect( () => {
    if ( !user ) {
      // By-pass CloudFlare authentication on dev or local env
      const _isDev = isDevEnvironment();
      if ( !_isDev ) {
        login();
      }
      setIsDev( _isDev );
    }
  }, [] );

  if ( isDev ) {
    return <Login />;
  }

  return (
    <div style={ { height: '30vh', paddingTop: '6rem' } }>
      <Loader size="medium" active inline="centered">
        Loading
      </Loader>
    </div>
  );
};

LoginPage.getInitialProps = async ctx => {
  const user = await fetchUser( ctx );
  if ( user ) {
    redirectTo( '/', { res: ctx?.res } );
  }
};

export default LoginPage;
