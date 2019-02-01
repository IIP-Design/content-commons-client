import React from 'react';
import Login from '../components/Login/Login';
import User from '../components/User/User';

const LoginPage = () => (
  <User>
    {
      ( { data } ) => <Login user={ data.authenticatedUser } />
    }
  </User>
);


export default LoginPage;
