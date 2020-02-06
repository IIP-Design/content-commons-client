/**
 *
 * LoggedInNav
 *
 */

import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Menu, Icon
} from 'semantic-ui-react';
import HamburgerIcon from '../HamburgerIcon';

const menuItems = [
  {
    key: 1,
    name: 'about',
    to: '/about',
    label: 'About'
  },
  {
    key: 2,
    name: 'help',
    to: '/help',
    label: 'Help'
  },
  {
    key: 3,
    name: 'documentation',
    to: '/documentation',
    label: 'Documentation'
  }
];

const LoggedOutNav = props => {
  const {
    mobileMenuVisible, toggleMobileMenu, keyUp,
  } = props;


  const closeMobileMenu = () => {
    toggleMobileMenu( false );
  };


  useEffect( () => {
    window.addEventListener( 'resize', closeMobileMenu );
    return () => {
      window.removeEventListener( 'resize', closeMobileMenu );
    };
  }, [] );


  const renderFeedbackButton = () => (
    <a
      href="https://goo.gl/forms/9cJ3IBHH9QTld2Mj2"
      target="_blank"
      className="item feedback"
      rel="noopener noreferrer"
    >
      { ' ' }
      Feedback
    </a>
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
    <Menu.Item key={ item.key } name={ item.name }>
      <Link href={ item.to } passHref>
        { item.label }
      </Link>
    </Menu.Item>
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
        <li>
          <Link href="/login">
            <a>
              <span onClick={ () => toggleMobileMenu( false ) } onKeyUp={ keyUp } role="presentation">
                Login
              </span>
            </a>
          </Link>
        </li>
        { renderFeedbackButton() }
      </ul>
    );
  };

  const renderDesktopNav = items => (
    <>
      <Menu className="nav_loggedout">
        { items.map( item => renderMenuItem( item ) ) }
        <Menu.Item key="4" name="login">
          <a href="/login">Login</a>
        </Menu.Item>
        { renderFeedbackButton() }
      </Menu>
    </>
  );


  return (
    <>
      { /* Desktop nav */ }
      { !mobileMenuVisible && (
        <div>
          { renderDesktopNav( menuItems ) }
        </div>
      ) }

      { /* Mobile nav */ }
      <div>{ renderMobileNav( menuItems ) }</div>
    </>
  );
};

LoggedOutNav.propTypes = {
  mobileMenuVisible: PropTypes.bool,
  toggleMobileMenu: PropTypes.func,
  keyUp: PropTypes.func
};

export default LoggedOutNav;
