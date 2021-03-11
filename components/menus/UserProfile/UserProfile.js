import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import LogoutButton from 'components/Logout/Logout';
import { hasPagePermissions } from 'context/authContext';
import config from 'config';

import '../menu.scss';

class UserProfileMenu extends Component {
  render() {
    const { user, closePopup } = this.props;
    const isSubscriber = !hasPagePermissions( user );
    const name = ( user.firstName ) || '';
    const logOutStyle = {
      borderRadius: 0,
      padding: '20px 0 20px 15px',
      textAlign: 'left',
      fontSize: '16px',
      color: '#112e51',
      backgroundColor: 'transparent',
    };

    return (
      <div className="nav_submenu">
        <div className="nav_submenu_header">
          <p className="nav_submenu_header_item nav_submenu_header_item--title">
            { 'Welcome ' }
            { name }
            { name && '!' }

          </p>
        </div>
        <section className="nav_submenu_section">
          { !isSubscriber && (
            <Link href="/admin/dashboard">
              <a className="nav_submenu_item nav_submenu_item--margin">
                <span onClick={ closePopup } role="presentation">
                  Dashboard
                </span>
              </a>
            </Link>
          ) }
          <Link href="/profile" prefetch={ false }>
            <a className="nav_submenu_item nav_submenu_item--profile_settings">
              <span onClick={ closePopup } role="presentation">
                Profile Settings
              </span>
            </a>
          </Link>
        </section>
        <section className="nav_submenu_section">
          <Link href="/about">
            <a className="nav_submenu_item nav_submenu_item--margin">
              <span onClick={ closePopup } role="presentation">
                About
              </span>
            </a>
          </Link>
          <Link href="/help">
            <a className="nav_submenu_item nav_submenu_item--margin">
              <span onClick={ closePopup } role="presentation">
                Help
              </span>
            </a>
          </Link>
          <Link href="/documentation">
            <a className="nav_submenu_item">
              <span onClick={ closePopup } role="presentation">
                Documentation
              </span>
            </a>
          </Link>
        </section>
        <section className="nav_submenu_section">
          <a
            target="_blank"
            href={ config.FEEDBACK_FORM_URL }
            rel="noopener noreferrer"
            className="nav_submenu_item"
            onClick={ closePopup }
          >
            Send Feedback
          </a>
        </section>
        <section className="nav_submenu_section nav_submenu_section--logout">
          <LogoutButton className="primary" fluid style={ logOutStyle } />
        </section>
      </div>
    );
  }
}

UserProfileMenu.propTypes = {
  closePopup: PropTypes.func,
  user: PropTypes.object,
};

export default UserProfileMenu;
