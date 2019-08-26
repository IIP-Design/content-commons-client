import React from 'react';
import PropTypes from 'prop-types';
import iconAlert from 'static/icons/icon_alert.svg';
import './GeneralError.scss';

const GeneralError = props => {
  const {
    children, el: Element, icon, msg, style
  } = props;

  return (
    <Element className="general-error" style={ style }>
      <div className="icon">
        { icon && <img src={ iconAlert } alt="alert icon" /> }
        { msg }
      </div>
      { children }
    </Element>
  );
};

GeneralError.propTypes = {
  children: PropTypes.node,
  el: PropTypes.string,
  icon: PropTypes.bool,
  msg: PropTypes.oneOfType( [
    PropTypes.node,
    PropTypes.string
  ] ),
  style: PropTypes.object
};

GeneralError.defaultProps = {
  el: 'div',
  icon: true,
  msg: '',
  style: {}
};

export default GeneralError;
