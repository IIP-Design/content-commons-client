/**
 *
 * Global Nav
 *
 */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import { useAuth } from 'context/authContext';
import { Loader } from 'semantic-ui-react';
import './global.scss';

const LoggedInNav = dynamic( () => import( /* webpackChunkName: "LoggedInNav" */ './LoggedInNav/LoggedInNav' ) );
const LoggedOutNav = dynamic( () => import( /* webpackChunkName: "LoggedOutNav" */ './LoggedOutNav/LoggedOutNav' ) );

const GlobalNav = () => {
  const [mobileMenuVisible, setMobileMenuVisible] = useState( false );
  const { user, loading } = useAuth();

  console.log( 'IN nav' );
  if ( user && user.id !== 'public' ) {
    console.dir( user );
  } else {
    console.log( 'user is NUL' );
  }


  const toggleMobileMenu = flag => {
    setMobileMenuVisible( flag );
  };

  const handleKeyUp = e => {
    if ( e.key === 'Enter' ) {
      toggleMobileMenu();
    }
  };


  if ( loading ) {
    return (
      <nav className="loader">
        <Loader size="tiny" inverted active />
      </nav>
    );
  }

  return (
    <nav>
      { user && user.id !== 'public' ? (
        <LoggedInNav
          mobileMenuVisible={ mobileMenuVisible }
          toggleMobileMenu={ toggleMobileMenu }
          keyUp={ handleKeyUp }
          user={ user }
        />
      ) : (
        <LoggedOutNav
          mobileMenuVisible={ mobileMenuVisible }
          toggleMobileMenu={ toggleMobileMenu }
          keyUp={ handleKeyUp }
        />
      ) }
    </nav>
  );
};

export default GlobalNav;
