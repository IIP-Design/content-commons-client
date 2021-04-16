import React from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';

const HamburgerIcon = ( { mobileMenuVisible, toggleMobileMenu } ) => (
  <button
    type="button"
    className={ `hamburger ${mobileMenuVisible ? 'hide' : ''}` }
    onClick={ toggleMobileMenu }
    onKeyUp={ toggleMobileMenu }
  >
    <VisuallyHidden el="span">menu</VisuallyHidden>
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
