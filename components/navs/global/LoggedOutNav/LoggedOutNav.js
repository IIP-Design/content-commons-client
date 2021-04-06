/**
 *
 * LoggedInNav
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import config from 'config';
import useTimeout from 'lib/hooks/useTimeout';
import closeIcon from 'static/icons/icon_close.svg';
import HamburgerIcon from '../HamburgerIcon';

const menuItems = [
  {
    key: 1,
    name: 'about',
    to: '/about',
    label: 'About',
  },
  {
    key: 2,
    name: 'help',
    to: '/help',
    label: 'Help',
  },
  {
    key: 3,
    name: 'documentation',
    to: '/documentation',
    label: 'Documentation',
  },
  {
    key: 4,
    name: 'login',
    to: '/login',
    label: 'Login',
  },
];

const LoggedOutNav = props => {
  const {
    mobileMenuVisible, toggleMobileMenu, keyUp,
  } = props;


  const closeMobileMenu = () => {
    toggleMobileMenu( false );
  };

  const [reminder, setReminder] = useState( false );

  const { startTimeout: showReminder } = useTimeout( () => setReminder( true ), 5000 );
  const { startTimeout: hideReminder } = useTimeout( () => setReminder( false ), 35000 );

  useEffect( () => {
    window.addEventListener( 'resize', closeMobileMenu );

    showReminder();
    hideReminder();

    return () => {
      window.removeEventListener( 'resize', closeMobileMenu );
    };
  }, [] );


  const renderFeedbackButton = () => (
    <li className="item feedback-item">
      <a
        href={ config.FEEDBACK_FORM_URL }
        target="_blank"
        className="feedback"
        rel="noopener noreferrer"
      >
        Feedback
      </a>
    </li>
  );

  const renderMenuLink = item => {
    if ( mobileMenuVisible ) {
      return (
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        <a onKeyUp={ keyUp } onClick={ () => toggleMobileMenu( false ) }>
          { item.label }
        </a>
      );
    }

    return <a>{ item.label }</a>;
  };

  const renderMenuItem = item => (
    <li key={ item.key } className="item" name={ item.name }>
      <Link href={ item.to }>
        { renderMenuLink( item ) }
      </Link>
    </li>
  );

  const renderMobileNav = items => {
    if ( !mobileMenuVisible ) {
      return (
        <HamburgerIcon
          mobileMenuVisible={ mobileMenuVisible }
          toggleMobileMenu={ () => toggleMobileMenu( true ) }
        />
      );
    }

    return (
      <ul className="mobile">
        <li className="mobile-toggle">
          <button type="button" onClick={ () => toggleMobileMenu( false ) } onKeyUp={ keyUp }>
            <img
              src={ closeIcon }
              alt="close menu"
              height="24"
              width="24"
            />
          </button>
        </li>
        { items.map( item => renderMenuItem( item ) ) }
        { renderFeedbackButton() }
      </ul>
    );
  };

  const renderDesktopNav = items => (
    <ul className="ui nav_loggedout menu">
      { items.map( item => renderMenuItem( item ) ) }
      { reminder && (
        <li className="login_reminder">
          DOS employees, you can log in to see more content.
          { ' ' }
          <button
            type="button"
            aria-label="Close Login Reminder"
            className="login_reminder_close"
            onClick={ () => setReminder( false ) }
          >
            Got it
          </button>
        </li>
      ) }
      { renderFeedbackButton() }
    </ul>
  );


  return (
    <Fragment>
      { /* Desktop nav */ }
      { !mobileMenuVisible && (
        <div>
          { renderDesktopNav( menuItems ) }
        </div>
      ) }

      { /* Mobile nav */ }
      <div>{ renderMobileNav( menuItems ) }</div>
    </Fragment>
  );
};

LoggedOutNav.propTypes = {
  mobileMenuVisible: PropTypes.bool,
  toggleMobileMenu: PropTypes.func,
  keyUp: PropTypes.func,
};

export default LoggedOutNav;
