/**
 *
 * Notification
 *
 */

import React from 'react';
import { object, string, bool } from 'prop-types';

const Notification = props => {
  const { el, msg, customStyles } = props;
  const El = el;
  const defaultStyle = {
    padding: '1em 1.5em',
    fontSize: '0.75em',
    backgroundColor: '#aee02d',
    display: props.show ? 'block' : 'none'
  };

  const style = { ...defaultStyle, ...customStyles };

  return <El style={ style }>{ msg }</El>;
};

Notification.propTypes = {
  el: string,
  msg: string.isRequired,
  customStyles: object,
  show: bool
};

Notification.defaultProps = {
  el: 'p'
};

export default Notification;
