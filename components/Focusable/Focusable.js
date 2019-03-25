/**
 *
 * Focusable
 *
 */

import React from 'react';
import { node, number } from 'prop-types';
import './Focusable.scss';


const Focusable = props => (
  /* eslint-disable jsx-a11y/no-noninteractive-tabindex */
  <span className="focusable" tabIndex={ props.order }>
    { props.children }
  </span>
);

Focusable.propTypes = {
  children: node,
  order: number
};

Focusable.defaultProps = {
  order: 0
};

export default Focusable;
