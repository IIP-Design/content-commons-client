/**
 *
 * LoggedOutNav
 *
 */


import React from 'react';
import { bool, func } from 'prop-types';
import Link from 'next/link';
import { Menu, Icon } from 'semantic-ui-react';

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
    label: 'Documentation',
  }
];

const LoggedOutNav = props => {
  const { mobileNavVisible, toggleMobileNav, keyUp } = props;

  return (
    <span>
      <div className="ui compact secondary menu nav_loggedout_wrapper">
        { !mobileNavVisible && menuItems.map( item => (
          <Menu.Item key={ item.key } name={ item.name }>
            <Link href={ item.to }><a>{ item.label }</a></Link>
          </Menu.Item>
        ) ) }
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
          { menuItems.map( item => (
            <li key={ item.key }>
              <Link href={ item.to }>
                <a>
                  <span onClick={ toggleMobileNav } onKeyUp={ keyUp } role="presentation">
                    { item.label }
                  </span>
                </a>
              </Link>
            </li>
          ) ) }
          <li>
            <a
              href="https://goo.gl/forms/PyLjAiaJVt3xONsd2"
              target="_blank"
              className="item feedback"
              rel="noopener noreferrer"
            >
              Feedback
            </a>
          </li>
        </ul>
        )
      }
    </span>
  );
};

LoggedOutNav.propTypes = {
  mobileNavVisible: bool,
  toggleMobileNav: func,
  keyUp: func
};

export default LoggedOutNav;
