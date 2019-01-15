import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from '../../User';
import '../menu.scss';


const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut
  }
`;

class UserProfileMenu extends Component {
  handleSignoutClick = signoutMutation => {
    signoutMutation();
    const { toggleMobileNav, logout } = this.props;
    if ( toggleMobileNav ) {
      toggleMobileNav();
    }
    // Router.push( {
    //   pathname: '/'
    // } );
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
          <Mutation mutation={ SIGN_OUT_MUTATION } refetchQueries={ [{ query: CURRENT_USER_QUERY }] }>
            { signOut => (
              <a className="nav_submenu_item">
                <span
                  onClick={ () => {
                    this.handleSignoutClick( signOut );
                  } }
                  role="presentation"
                >Logout
                </span>
              </a>
            ) }
          </Mutation>
        </section>
      </div>
    );
  }
}

UserProfileMenu.propTypes = {
  toggleMobileNav: PropTypes.func,
  logout: PropTypes.func,
  submenuClosePopup: PropTypes.func,
  user: PropTypes.string
};

export default UserProfileMenu;
