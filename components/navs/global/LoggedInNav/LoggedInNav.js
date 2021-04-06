/**
 *
 * LoggedInNav
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Popup } from 'semantic-ui-react';
import UserProfileMenu from 'components/menus/UserProfile/UserProfile';
import NotificationsMenu from 'components/menus/Notifications/Notifications';
import closeIcon from 'static/icons/icon_close.svg';
import notifyIcon from 'static/icons/icon_notifications.svg';
import userIcon from 'static/icons/icon_user_profile.svg';
import uploadIcon from 'static/icons/icon_upload.svg';
import { hasPagePermissions } from 'context/authContext';
import config from 'config';
import HamburgerIcon from '../HamburgerIcon';

const menuItems = [
  {
    key: 1,
    name: 'upload',
    icon: uploadIcon,
    width: 34,
    height: 34,
    alt: 'Upload content',
  },
  {
    key: 2,
    name: 'notifications',
    icon: notifyIcon,
    width: 30,
    height: 30,
    alt: 'View notifications',
  },
  {
    key: 3,
    name: 'user_profile',
    icon: userIcon,
    width: 26,
    height: 26,
    alt: 'View user profile',
    subscriber: true,
  },
];

const LoggedInNav = props => {
  const {
    mobileMenuVisible, toggleMobileMenu, keyUp, user,
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

  const renderMenuLink = item => {
    if ( mobileMenuVisible ) {
      return (
        /* eslint-disable jsx-a11y/no-static-element-interactions */
        <a onKeyUp={ keyUp } onClick={ () => toggleMobileMenu( false ) }>
          { getIcon( item ) }
        </a>
      );
    }

    return <a>{ getIcon( item ) }</a>;
  };

  const renderMenuItem = item => {
    // const active = hasNotifications ? 'active' : '';
    const disabled = item.name === 'notifications';

    return (
      <li
        key={ item.key }
        className={ `item${disabled ? ' disabled' : ''}` }
        name={ item.name }
        disabled={ disabled }
      >
        { item.name === 'upload'
          ? (
            <Link href="/admin/upload">
              { renderMenuLink( item ) }
            </Link>
          )
          : (
            <button type="button" disabled={ disabled }>
              { getIcon( item ) }
            </button>
          ) }
      </li>
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
        { items.map( item => {
          if ( item.name === 'user_profile' ) {
            return renderPopUp( item, renderMenuItem );
          }

          return renderMenuItem( item );
        } ) }
        { renderFeedbackButton() }
      </ul>
    );
  };

  const renderDesktopNav = items => (
    <ul className="ui menu">
      { items.map( item => {
        if ( item.name === 'user_profile' ) {
          return renderPopUp( item, renderMenuItem );
        }

        return renderMenuItem( item );
      } ) }
      { renderFeedbackButton() }
    </ul>
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
  user: PropTypes.object,
};

export default LoggedInNav;
