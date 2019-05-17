/**
 *
 * LoggedInNav
 *
 */

import React, { Component } from 'react';
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
    alt: 'View user profile'
  }
];

class LoggedInNav extends Component {
  state = {
    user_profile: false,
    notifications: false,
    hasNotifications: false
  }

  getIcon = item => (
    <img src={ item.icon } width={ item.width } height={ item.height } alt={ item.alt } />
  )

  displayPopup = ( e, data ) => {
    if ( data.id === 'notifications' && !this.state.hasNotifications ) return;
    this.setState( { [data.id]: true } );
  }

  closePopup = ( e, data ) => {
    this.setState( { [data.id]: false } );
  }

  submenuClosePopup = () => {
    this.setState( {
      user_profile: false,
      notifications: false
    } );
  }

  renderMenu( menu ) {
    const { toggleMobileNav, user } = this.props;
    if ( menu === 'notifications' ) {
      return <NotificationsMenu submenuClosePopup={ this.submenuClosePopup } toggleMobileNav={ toggleMobileNav } />;
    }
    return <UserProfileMenu submenuClosePopup={ this.submenuClosePopup } toggleMobileNav={ toggleMobileNav } user={ user.firstName } />;
  }

  render() {
    const {
      mobileNavVisible, toggleMobileNav, keyUp, user
    } = this.props;
    const { hasNotifications } = this.state;

    const active = hasNotifications ? 'active' : '';

    return (
      <span>
        <div className="ui compact secondary menu nav_loggedin_wrapper">
          {
            menuItems.map( item => {
              if ( item.name === 'upload' ) {
                return (
                  <Menu.Item key={ item.key } name={ item.name } className={ `nav_loggedin ${item.name}` }>
                    <Link prefetch href="/admin/upload" passHref>{ this.getIcon( item ) }</Link>
                  </Menu.Item>
                );
              }

              return (
                <Popup
                  key={ item.key }
                  id={ item.name }
                  className="nav_submenu_popup"
                  trigger={ (
                    <Menu.Item
                      key={ item.key }
                      name={ item.name }
                      className={
                        item.name === 'notifications'
                          ? `nav_loggedin ${item.name} ${active}`
                          : `nav_loggedin ${item.name}`
                      }
                    >
                      { this.getIcon( item ) }
                    </Menu.Item>
                  ) }

                  content={
                    item.name === 'notifications'
                      ? <NotificationsMenu submenuClosePopup={ this.submenuClosePopup } />
                      : <UserProfileMenu submenuClosePopup={ this.submenuClosePopup } user={ user.firstName } />
                  }
                  on="click"
                  open={ this.state[`${item.name}`] }
                  onOpen={ this.displayPopup }
                  onClose={ this.closePopup }
                  position="bottom center"
                />
              );
            } )
          }
          <a
            href="https://goo.gl/forms/9cJ3IBHH9QTld2Mj2"
            target="_blank"
            className="item feedback"
            rel="noopener noreferrer"
          >
            Feedback
          </a>
        </div>

        {
          mobileNavVisible
          && (
          <ul className="mobileMenu">
            <li>
              <Icon name="close" onClick={ toggleMobileNav } onKeyUp={ keyUp } tabIndex={ 0 } />
            </li>
            { menuItems.map( item => {
              if ( item.name === 'upload' ) {
                return (
                  <li key={ item.key }>
                    <Link prefetch href="/admin/upload">
                      <a className="item">
                        <span onClick={ toggleMobileNav } onKeyUp={ keyUp } role="presentation">
                          { this.getIcon( item ) }
                        </span>
                      </a>
                    </Link>
                  </li>
                );
              }
              return (
                <Popup
                  key={ item.key }
                  id={ item.name }
                  className="nav_submenu_popup"
                  trigger={ (
                    <li
                      key={ item.key }
                      className={
                        item.name === 'notifications'
                          ? `mobile_loggedin ${item.name} ${active}`
                          : `mobile_loggedin ${item.name}`
                      }
                    >
                      { this.getIcon( item ) }
                    </li>
                  ) }
                  content={ this.renderMenu( item.name ) }
                  on="click"
                  open={ this.state[`${item.name}`] }
                  onOpen={ this.displayPopup }
                  onClose={ this.closePopup }
                  position="bottom center"
                />
              );
            } ) }
            <li>
              <a
                href="https://goo.gl/forms/PyLjAiaJVt3xONsd2"
                target="_blank"
                className="item feedback"
                rel="noopener noreferrer"
                onClick={ toggleMobileNav }
              >
                Feedback
              </a>
            </li>
          </ul>
          )
        }
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
