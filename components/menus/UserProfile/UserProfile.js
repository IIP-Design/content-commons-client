import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import LogoutButton from 'components/Logout/Logout';
import '../menu.scss';

class UserProfileMenu extends Component {
  handleSignoutClick = signoutMutation => {
    signoutMutation();
    const { toggleMobileNav } = this.props;
    if ( toggleMobileNav ) {
      toggleMobileNav();
    }
    Router.push( {
      pathname: '/login'
    } );
  }

  linkClick = () => {
    const { toggleMobileNav, submenuClosePopup } = this.props;
    if ( toggleMobileNav ) {
      toggleMobileNav();
    }
    submenuClosePopup();
  }

  render() {
    const { user } = this.props;
    const name = ( user ) || '';
    const logOutStyle = {
      borderRadius: 0,
      padding: '20px 0 20px 15px',
      textAlign: 'left',
      fontSize: '16px',
      color: '#112e51',
      backgroundColor: 'transparent'
    };

    return (
      <div className="nav_submenu">
        <div className="nav_submenu_header">
          <p className="nav_submenu_header_item nav_submenu_header_item--title">
            Welcome { name }!
          </p>
        </div>
        <section className="nav_submenu_section">
          <Link href="/admin/dashboard">
            <a className="nav_submenu_item nav_submenu_item--margin">
              <span onClick={ this.linkClick } role="presentation">Dashboard</span>
            </a>
          </Link>
          <Link href="/profile">
            <a className="nav_submenu_item nav_submenu_item--profile_settings">
              <span onClick={ this.linkClick } role="presentation">Profile Settings</span>
            </a>
          </Link>
        </section>
        <section className="nav_submenu_section">
          <Link href="/about">
            <a className="nav_submenu_item nav_submenu_item--margin">
              <span onClick={ this.linkClick } role="presentation">About</span>
            </a>
          </Link>
          <Link href="/help">
            <a className="nav_submenu_item">
              <span onClick={ this.linkClick } role="presentation">Help</span>
            </a>
          </Link>
        </section>
        <section className="nav_submenu_section">
          <a
            target="_blank"
            href="https://goo.gl/forms/PyLjAiaJVt3xONsd2"
            rel="noopener noreferrer"
            className="nav_submenu_item"
            onClick={ this.linkClick }
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
  toggleMobileNav: PropTypes.func,
  submenuClosePopup: PropTypes.func,
  user: PropTypes.string
};

export default UserProfileMenu;
