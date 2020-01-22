/**
 *
 * Global Nav
 *
 * TODO: Need to rewrite menus without the semantic ui
 * <Responsive /> as it throws an error due to ssr:
 * "Warning: Did not expect server HTML to contain a <i> in <nav>""
 *
 */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import './global.scss';
// import User from 'components/User/User';
import { useAuth } from 'context/authContext';

const LoggedInNav = dynamic( () => import( /* webpackChunkName: "LoggedInNav" */ './LoggedInNav/LoggedInNav' ) );
const LoggedOutNav = dynamic( () => import( /* webpackChunkName: "LoggedOutNav" */ './LoggedOutNav/LoggedOutNav' ) );

const GlobalNav = () => {
  const [mobileNavVisible, setMobileNavVisible] = useState( false );
  const { user } = useAuth();

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

  return (
    <nav>
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
