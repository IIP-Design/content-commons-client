import React from 'react';
import { useAuth } from 'context/authContext';
import Login from 'components/Login/Login';
import { isDevEnvironment } from 'lib/browser';
import { Loader } from 'semantic-ui-react';

const LoginPage = () => {
  const { user, login } = useAuth();

  // By-pass CloudFlare authentication on dev or local env
  if ( isDevEnvironment() ) {
    return <Login />;
  }

  if ( !user ) {
    login();
  }

  return (
    <div style={ { height: '60vh' } }>
      <Loader size="medium" active>
        Loading
      </Loader>
    </div>
  );
};


export default LoginPage;
