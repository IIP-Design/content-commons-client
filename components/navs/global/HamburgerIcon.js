import React from 'react';
import PropTypes from 'prop-types';

const HamburgerIcon = ( { mobileMenuVisible, toggleMobileMenu } ) => (
  <button
    type="button"
    className={ `hamburger ${mobileMenuVisible ? 'hide' : ''}` }
    onClick={ toggleMobileMenu }
    onKeyUp={ toggleMobileMenu }
    tabIndex={ 0 }
  >
    <span className="bar" />
    <span className="bar" />
    <span className="bar" />
  </button>
);

HamburgerIcon.propTypes = {
  mobileMenuVisible: PropTypes.bool,
  toggleMobileMenu: PropTypes.func,
};


export default HamburgerIcon;
