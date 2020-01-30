/**
 *
 * Global Nav
 *
 */
import React, { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { useAuth, hasPagePermissions } from 'context/authContext';
import { Loader } from 'semantic-ui-react';
import './global.scss';

const LoggedInNav = dynamic( () => import( /* webpackChunkName: "LoggedInNav" */ './LoggedInNav/LoggedInNav' ) );
const LoggedOutNav = dynamic( () => import( /* webpackChunkName: "LoggedOutNav" */ './LoggedOutNav/LoggedOutNav' ) );

const GlobalNav = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState( false );
  const [isSubscriber, setIsSubscriber] = useState( true );
  const { user, loading } = useAuth();

  useEffect( () => {
    if ( !user ) {
      setIsSubscriber( false );
    } else {
      setIsSubscriber( !hasPagePermissions( user ) );
    }
  }, [user] );

  const handleNavClick = () => {
    if ( !mobileNavVisible ) {
      setMobileNavVisible( true );
    } else {
      setMobileNavVisible( false );
    }
  };

  const handleKeyUp = e => {
    if ( e.key === 'Enter' ) {
      handleNavClick();
    }
  };

  const renderHamburgerMenu = () => (
    <button
      type="button"
      className="mobileNavBurger"
      onClick={ handleNavClick }
      onKeyUp={ handleKeyUp }
      tabIndex={ 0 }
    >
      <span className="bar" />
      <span className="bar" />
      <span className="bar" />
    </button>
  );

  if ( loading ) {
    return (
      <nav style={ { marginTop: '1rem', marginRight: '1rem' } }>
        <Loader size="tiny" inverted active />
      </nav>
    );
  }

  return (
    <nav>
      { /* Subscriber only has 1 item, so do not show hambruger menu */ }
      { !isSubscriber && renderHamburgerMenu() }
      { user ? (
        <LoggedInNav
          mobileNavVisible={ mobileNavVisible }
          toggleMobileNav={ handleNavClick }
          keyUp={ handleKeyUp }
          user={ user }
        />
      ) : (
        <LoggedOutNav
          mobileNavVisible={ mobileNavVisible }
          toggleMobileNav={ handleNavClick }
          keyUp={ handleKeyUp }
        />
      ) }
    </nav>
  );
};

export default GlobalNav;
