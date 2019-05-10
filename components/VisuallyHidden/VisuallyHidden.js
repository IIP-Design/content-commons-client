/**
 *
 * VisuallyHidden
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import './VisuallyHidden.scss';

const VisuallyHidden = ( { el: Element, children } ) => (
  <Element className="hide-visually">{ children }</Element>
);

VisuallyHidden.propTypes = {
  el: PropTypes.string,
  children: PropTypes.node
};

VisuallyHidden.defaultProps = {
  el: 'div'
};

export default VisuallyHidden;
