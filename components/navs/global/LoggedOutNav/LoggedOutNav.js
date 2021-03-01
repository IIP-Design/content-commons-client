/**
 *
 * LoggedInNav
 *
 */

import React, { Fragment, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Icon } from 'semantic-ui-react';
import config from 'config';
import useTimeout from 'lib/hooks/useTimeout';
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


  const renderListItem = item => (
    <li key={ item.key }>
      <Link href={ item.to }>
        <a className="item">
          <span onClick={ () => toggleMobileMenu( false ) } onKeyUp={ keyUp } role="presentation">
            { item.label }
          </span>
        </a>
      </Link>
    </li>
  );

  const renderMenuItem = item => (
    <li key={ item.key } className="item" name={ item.name }>
      <Link href={ item.to } passHref>
        <a>{ item.label }</a>
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
      <ul>
        <li>
          <Icon name="close" onClick={ () => toggleMobileMenu( false ) } onKeyUp={ keyUp } tabIndex={ 0 } />
        </li>
        { items.map( item => renderListItem( item ) ) }
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
