/**
 *
 * Notification
 *
 */

import React from 'react';
import { object, string } from 'prop-types';

import colors from 'styles/colors.scss';

const Notification = props => {
  const { el, msg, customStyles } = props;
  const El = el;
  const defaultStyle = {
    padding: '1em 1.5em',
    fontSize: '0.75em',
    backgroundColor: colors.pear
  };

  const style = { ...defaultStyle, ...customStyles };

  return <El style={ style }>{ msg }</El>;
};

Notification.propTypes = {
  el: string,
  msg: string.isRequired,
  customStyles: object
};

Notification.defaultProps = {
  el: 'p'
};

export default Notification;
