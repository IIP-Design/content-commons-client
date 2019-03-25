/**
 *
 * VisuallyHidden
 *
 */

import React from 'react';
import { node } from 'prop-types';
import './VisuallyHidden.scss';

const VisuallyHidden = props => (
  <div className="hide-visually">{ props.children }</div>
);

VisuallyHidden.propTypes = {
  children: node
};

export default VisuallyHidden;
