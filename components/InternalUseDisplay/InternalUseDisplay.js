import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import './InternalUseDisplay.scss';

const renderInternalUseText = ( className, expanded, style ) => {
  if ( expanded ) {
    return <p className={ `internal-use expanded ${className}` } style={ style }>INTERNAL USE ONLY - NOT FOR PUBLIC DISTRIBUTION</p>;
  }
  return <p className={ `internal-use brief ${className}` } style={ style }>INTERNAL USE ONLY</p>;
};

const InternalUseDisplay = ( { className, expanded, style } ) => (
  <Fragment>{ renderInternalUseText( className, expanded, style ) }</Fragment>
);

InternalUseDisplay.defaultProps = {
  className: '',
  style: {}
};

InternalUseDisplay.propTypes = {
  className: PropTypes.string,
  expanded: PropTypes.bool,
  style: PropTypes.object
};

export default InternalUseDisplay;
