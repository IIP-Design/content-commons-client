/**
 *
 * Notification
 *
 */

import React from 'react';
import {
  object, string, bool
} from 'prop-types';
import { Icon } from 'semantic-ui-react';

const Notification = props => {
  const {
    el, classes, msg, customStyles, icon
  } = props;
  const El = el;
  const defaultStyle = {
    padding: '1em 1.5em',
    fontSize: '0.75em',
    backgroundColor: '#aee02d',
    display: props.show ? 'block' : 'none'
  };

  const style = { ...defaultStyle, ...customStyles };

  return (
    <El className={ classes } style={ style }>
      <Icon loading name="spinner" style={ { display: icon ? 'inline-block' : 'none' } } /> { msg }
    </El>
  );
};

Notification.propTypes = {
  el: string,
  classes: string,
  msg: string.isRequired,
  customStyles: object,
  show: bool,
  icon: bool,
};

Notification.defaultProps = {
  el: 'p'
};

export default Notification;
