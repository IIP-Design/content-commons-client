/**
 *
 * LoggedInNav
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Menu, Popup, Icon
} from 'semantic-ui-react';
import UserProfileMenu from 'components/menus/UserProfile/UserProfile';
import NotificationsMenu from 'components/menus/Notifications/Notifications';
import notifyIcon from 'static/icons/icon_notifications.svg';
import userIcon from 'static/icons/icon_user_profile.svg';
import uploadIcon from 'static/icons/icon_upload.svg';
import { hasPagePermissions } from 'context/authContext';
import HamburgerIcon from '../HamburgerIcon';

const menuItems = [
  {
    key: 1,
    name: 'upload',
    icon: uploadIcon,
    width: 34,
    height: 34,
    alt: 'Upload content'
  },
  {
    key: 2,
    name: 'notifications',
    icon: notifyIcon,
    width: 30,
    height: 30,
    alt: 'View notifications'
  },
  {
    key: 3,
    name: 'user_profile',
    icon: userIcon,
    width: 26,
    height: 26,
    alt: 'View user profile',
    subscriber: true
  }
];

const LoggedInNav = props => {
  const {
    mobileMenuVisible, toggleMobileMenu, keyUp, user
  } = props;

  // const [hasNotifications, setHasNotifications] = useState( false );
  const [popupState, setPopupState] = useState( false );

  const closeMobileMenu = () => {
    setPopupState( false );
    toggleMobileMenu( false );
  };

  const closePopup = () => {
    setPopupState( false );
  };

  const openPopup = () => {
    setPopupState( true );
  };


  useEffect( () => {
    window.addEventListener( 'resize', closeMobileMenu );
    return () => {
      window.removeEventListener( 'resize', closeMobileMenu );
    };
  }, [] );


  const getIcon = item => (
    <img
      src={ item.icon }
      width={ item.width }
      height={ item.height }
      alt={ item.alt }
    />
  );


  const renderFeedbackButton = () => (
    <a
      href="https://goo.gl/forms/9cJ3IBHH9QTld2Mj2"
      target="_blank"
      className="item feedback"
      rel="noopener noreferrer"
    > Feedback
    </a>
  );

  const renderMenu = menu => {
    if ( menu === 'notifications' ) {
      return <NotificationsMenu closePopup={ closeMobileMenu } />;
    }

    return (
      <UserProfileMenu closePopup={ closeMobileMenu } user={ user } />
    );
  };

  const renderPopUp = ( item, renderTriggerFn ) => (
    <Popup
      key={ item.key }
      id={ item.name }
      className="nav_submenu_popup"
      trigger={ renderTriggerFn( item ) }
      content={ renderMenu( item.name ) }
      hideOnScroll
      on="click"
      open={ popupState }
      onOpen={ openPopup }
      onClose={ closePopup }
      position={ `bottom ${mobileMenuVisible ? 'center' : 'right'}` }
    />
  );


  const renderListItem = item => (
    <li key={ item.key }>
      { item.name === 'upload' ? (
        <Link href="/admin/upload">
          <a className="item">
            <span onClick={ () => toggleMobileMenu( false ) } onKeyUp={ keyUp } role="presentation">
              { getIcon( item ) }
            </span>
          </a>
        </Link>
      ) : (
        getIcon( item )
      ) }
    </li>
  );

  const renderMenuItem = item => {
    // const active = hasNotifications ? 'active' : '';
    const disabled = item.name === 'notifications';

    return (
      <Menu.Item key={ item.key } name={ item.name } disabled={ disabled }>
        { item.name === 'upload' ? (
          <Link href="/admin/upload" passHref>
            { getIcon( item ) }
          </Link>
        ) : (
          getIcon( item )
        ) }
      </Menu.Item>
    );
  };


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
        { items.map( item => {
          if ( item.name === 'user_profile' ) {
            return renderPopUp( item, renderListItem );
          }
          return renderListItem( item );
        } ) }
        { renderFeedbackButton() }
      </ul>
    );
  };

  const renderDesktopNav = items => (
    <Menu>
      { items.map( item => {
        if ( item.name === 'user_profile' ) {
          return renderPopUp( item, renderMenuItem );
        }
        return renderMenuItem( item );
      } ) }
      { renderFeedbackButton() }
    </Menu>
  );


  const isSubscriber = !hasPagePermissions( user );

  const _menuItems = isSubscriber ? menuItems.filter( item => item.subscriber ) : menuItems;

  return (
    <>
      { /* Desktop nav */ }
      { !mobileMenuVisible && (
        <div>
          { renderDesktopNav( _menuItems ) }
        </div>
      ) }

      { /* Mobile nav */ }
      <div>{ renderMobileNav( _menuItems ) }</div>
    </>
  );
};


LoggedInNav.propTypes = {
  mobileMenuVisible: PropTypes.bool,
  toggleMobileMenu: PropTypes.func,
  keyUp: PropTypes.func,
  user: PropTypes.object
};

export default LoggedInNav;
