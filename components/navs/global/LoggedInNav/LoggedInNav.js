/**
 *
 * LoggedInNav
 *
 */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Menu, Popup, Icon } from 'semantic-ui-react';
import UserProfileMenu from 'components/menus/UserProfile/UserProfile';
import NotificationsMenu from 'components/menus/Notifications/Notifications';
import notifyIcon from 'static/icons/icon_notifications.svg';
import userIcon from 'static/icons/icon_user_profile.svg';
import uploadIcon from 'static/icons/icon_upload.svg';
import { hasPagePermissions } from 'context/authContext';

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

class LoggedInNav extends Component {
  state = {
    user_profile: false,
    notifications: false,
    hasNotifications: false
  };

  getIcon = item => <img src={ item.icon } width={ item.width } height={ item.height } alt={ item.alt } />;

  displayPopup = ( e, data ) => {
    if ( data.id === 'notifications' && !this.state.hasNotifications ) return;
    this.setState( { [data.id]: true } );
  };

  closePopup = ( e, data ) => {
    this.setState( { [data.id]: false } );
  };

  submenuClosePopup = () => {
    this.setState( {
      user_profile: false,
      notifications: false
    } );
  };

  renderMenu( menu ) {
    const { toggleMobileNav, user } = this.props;
    if ( menu === 'notifications' ) {
      return (
        <NotificationsMenu
          submenuClosePopup={ this.submenuClosePopup }
          toggleMobileNav={ toggleMobileNav }
        />
      );
    }
    return (
      <UserProfileMenu
        submenuClosePopup={ this.submenuClosePopup }
        toggleMobileNav={ toggleMobileNav }
        user={ user }
      />
    );
  }

  renderMenuItem( item ) {
    const { hasNotifications } = this.state;
    const active = hasNotifications ? 'active' : '';

    return (
      <Menu.Item
        key={ item.key }
        name={ item.name }
        className={
          item.name === 'notifications'
            ? `nav_loggedin ${item.name} ${active}`
            : `nav_loggedin ${item.name}`
        }
      >
        { item.name === 'upload' ? (
          <Link href="/admin/upload" passHref>
            { this.getIcon( item ) }
          </Link>
        ) : (
          this.getIcon( item )
        ) }
      </Menu.Item>
    );
  }

  renderListItem( item ) {
    const { toggleMobileNav, keyUp } = this.props;

    return (
      <li key={ item.key }>
        { item.name === 'upload' ? (
          <Link href="/admin/upload">
            <a className="item">
              <span onClick={ toggleMobileNav } onKeyUp={ keyUp } role="presentation">
                { this.getIcon( item ) }
              </span>
            </a>
          </Link>
        ) : (
          this.getIcon( item )
        ) }
      </li>
    );
  }

  renderNavItem( item ) {
    const { mobileNavVisible } = this.props;
    if ( mobileNavVisible ) {
      return this.renderListItem( item );
    }

    return this.renderMenuItem( item );
  }

  renderFeedbackButton = () => (
    <a
      href="https://goo.gl/forms/9cJ3IBHH9QTld2Mj2"
      target="_blank"
      className="item feedback"
      rel="noopener noreferrer"
    >
      Feedback
    </a>
  );


  renderPopUp( item ) {
    const { mobileNavVisible } = this.props;
    return (
      <Popup
        key={ item.key }
        id={ item.name }
        className="nav_submenu_popup"
        trigger={ this.renderNavItem( item ) }
        content={ this.renderMenu( item.name ) }
        on="click"
        open={ this.state[`${item.name}`] }
        onOpen={ this.displayPopup }
        onClose={ this.closePopup }
        position={ `bottom ${mobileNavVisible ? 'center' : 'right'}` }
      />
    );
  }

  renderNav( items ) {
    return (
      <>
        { items.map( item => {
          if ( item.name === 'upload' ) {
            return this.renderNavItem( item );
          }

          return this.renderPopUp( item );
        } ) }

      </>
    );
  }

  render() {
    const {
      mobileNavVisible, toggleMobileNav, keyUp, user
    } = this.props;

    const isSubscriber = !hasPagePermissions( user );
    const items = isSubscriber ? menuItems.filter( item => item.subscriber ) : menuItems;

    //  Subscriber only has 1 item, so vuew stays the same for all viewports
    if ( isSubscriber ) {
      return (
        <div className="ui compact secondary menu">
          { this.renderNav( items ) }
        </div>
      );
    }

    return (
      <span>
        <div className="ui compact secondary menu nav_loggedin_wrapper">
          { !mobileNavVisible && this.renderNav( items ) }
          { this.renderFeedbackButton() }
        </div>

        { mobileNavVisible && (
        <ul className="mobileMenu">
          <li>
            <Icon name="close" onClick={ toggleMobileNav } onKeyUp={ keyUp } tabIndex={ 0 } />
          </li>
          { this.renderNav( items ) }
          <li>{ this.renderFeedbackButton() }</li>
        </ul>
        ) }
      </span>
    );
  }
}

LoggedInNav.propTypes = {
  mobileNavVisible: PropTypes.bool,
  toggleMobileNav: PropTypes.func,
  keyUp: PropTypes.func,
  user: PropTypes.object
};

export default LoggedInNav;
