import React from 'react';
import PropTypes from 'prop-types';
import iconAlert from 'static/icons/icon_alert.svg';
import './GeneralError.scss';

const GeneralError = props => {
  const {
    children, el: Element, msg, style
  } = props;

  return (
    <Element className="general-error" style={ style }>
      <div className="icon">
        <img src={ iconAlert } alt="alert icon" />
        { msg }
      </div>
      { children }
    </Element>
  );
};

GeneralError.propTypes = {
  children: PropTypes.node,
  el: PropTypes.string,
  msg: PropTypes.string,
  style: PropTypes.object
};

GeneralError.defaultProps = {
  el: 'div',
  msg: '',
  style: {}
};

export default GeneralError;
