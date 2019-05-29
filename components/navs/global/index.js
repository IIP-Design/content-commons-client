/**
 *
 * Global Nav
 *
 * TODO: Need to rewrite menus without the semantic ui
 * <Responsive /> as it throws an error due to ssr:
 * "Warning: Did not expect server HTML to contain a <i> in <nav>""
 *
 */
import React, { PureComponent } from 'react';
import User from 'components/User/User';
import LoggedInNav from './LoggedInNav/LoggedInNav';
import LoggedOutNav from './LoggedOutNav/LoggedOutNav';

import './global.scss';

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
          { ( { data } ) => {
            const authenticatedUser = ( data && data.authenticatedUser ) ? data.authenticatedUser : null;
            return this.renderNav( authenticatedUser );
          }
        }
        </User>
      </nav>
    );
  }
}

export default GlobalNav;
