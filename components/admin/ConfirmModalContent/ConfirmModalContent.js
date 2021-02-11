/**
 *
 * ConfirmModalContent
 *
 */

import React from 'react';
import { node, object, string } from 'prop-types';
import './ConfirmModalContent.scss';

/* eslint-disable react/prefer-stateless-function */
const ConfirmModalContent = props => {
  const {
    children,
    className,
    headline,
    style,
  } = props;

  return (
    <div className={ className } style={ style }>
      <h2>{ headline }</h2>
      { children }
    </div>
  );
};

ConfirmModalContent.propTypes = {
  children: node,
  className: string,
  headline: string,
  style: object,
};

ConfirmModalContent.defaultProps = {
  style: {},
};

export default ConfirmModalContent;
