import React from 'react';
import Login from 'components/Login/Login';
import User from 'components/User/User';

const LoginPage = () => (
  <User>
    {
      ( { data } ) => {
        const user = data ? data.authenticatedUser : null;
        return ( <Login user={ user } /> );
      }
    }
  </User>
);


export default LoginPage;
