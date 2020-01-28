import React from 'react';
import { useAuth } from 'context/authContext';
import Login from 'components/Login/Login';
import { Loader } from 'semantic-ui-react';

const LoginPage = () => {
  const { user, login } = useAuth();

  // Return environment. Checking this way as enviromental env
  // is set to 'production' on dev server
  const isDevEnvironment = () => {
    const re = /(commons.dev.america.gov|localhost)/;
    return re.test( window.location.hostname );
  };

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
