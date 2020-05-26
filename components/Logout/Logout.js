import React from 'react';
import Router from 'next/router';
import { Button } from 'semantic-ui-react';

import { useAuth } from 'context/authContext';

const Logout = props => {
  const { logout } = useAuth();

  return (
    <Button
      { ...props }
      onClick={ async () => {
        await logout();
        Router.push( { pathname: '/' } );
      } }
    >
      Logout
    </Button>
  );
};


export default Logout;
