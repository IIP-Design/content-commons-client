/**
 *
 * Global Nav
 *
 */
import React, { PureComponent } from 'react';
import dynamic from 'next/dynamic';
import User from 'components/User/User';
import './global.scss';

const LoggedInNav = dynamic( () => import( /* webpackChunkName: "LoggedInNav" */ './LoggedInNav/LoggedInNav' ) );
const LoggedOutNav = dynamic( () => import( /* webpackChunkName: "LoggedOutNav" */ './LoggedOutNav/LoggedOutNav' ) );

class GlobalNav extends PureComponent {
  constructor( props ) {
    super( props );
    this.state = {
      mobileNavVisible: false
    };
  }


  handleKeyUp = e => {
    if ( e.key === 'Enter' ) {
      this.handleNavClick();
    }
  }

  handleNavClick = () => {
    const { mobileNavVisible } = this.state;
    if ( !mobileNavVisible ) {
      this.setState( { mobileNavVisible: true } );
    } else {
      this.setState( { mobileNavVisible: false } );
    }
  }

  renderNav( authenticatedUser ) {
    const { mobileNavVisible } = this.state;

    if ( authenticatedUser ) {
      return (
        <LoggedInNav
          mobileNavVisible={ mobileNavVisible }
          toggleMobileNav={ this.handleNavClick }
          keyUp={ this.keyUp }
          user={ authenticatedUser }
        />
      );
    }

    return (
      <LoggedOutNav
        mobileNavVisible={ mobileNavVisible }
        toggleMobileNav={ this.handleNavClick }
        keyUp={ this.keyUp }
      />
    );
  }

  render() {
    return (
      <nav>
        <button
          type="button"
          className="mobileNavBurger"
          onClick={ this.handleNavClick }
          onKeyUp={ this.keyUp }
          tabIndex={ 0 }
        >
          <span className="bar" />
          <span className="bar" />
          <span className="bar" />
        </button>
        <User>
          { ( { data, loading } ) => {
            if ( loading ) {
              return null;
            }
            const authenticatedUser = ( data && data.authenticatedUser ) ? data.authenticatedUser : null;
            return this.renderNav( authenticatedUser );
          } }
        </User>
      </nav>
    );
  }
}

export default GlobalNav;
