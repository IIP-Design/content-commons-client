import React from 'react';
import { useDispatch } from 'react-redux';
import { userLoggedOut } from 'lib/redux/actions/authentication';
import { Button } from 'semantic-ui-react';
import Router from 'next/router';
import { useAuth } from 'context/authContext';

const Logout = props => {
  const dispatch = useDispatch();

  // Remove redux action from props
  // - prevents redux action fn be added to DOM
  const filteredProps = Object.keys( props )
    .filter( prop => prop !== 'userLoggedOut' )
    .reduce( ( obj, prop ) => {
      obj[prop] = props[prop];
      return obj;
    }, {} );

  const { logout } = useAuth();
  return (
    <Button
      { ...filteredProps }
      onClick={ async () => {
        await logout();
        // update redux store
        dispatch( userLoggedOut() );
        Router.push( { pathname: '/' } );
      } }
    >Logout
    </Button>
  );
};


export default Logout;
