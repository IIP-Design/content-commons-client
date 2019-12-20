import React, { Fragment } from 'react';
import PropTypes from 'prop-types';

const styles = {
  brief: {    
    display: 'inline-block',
    margin: '0 1em 0 0',
    padding: '4px 10px',
    verticalAlign: 'top',
    fontSize: '12px',
    color: '#000',
    backgroundColor: '#d6d7d9',
  },
  expanded: {
    width: '100%',
    marginTop: '2em',
    padding: '11px 0',
    textAlign: 'center',
    fontSize: '12px',
    color: '#000',
    backgroundColor: '#d6d7d9',
  }
}

const InternalUseDisplay = ( { brief, expanded } ) => (
  <Fragment>
    { brief && <p style={ styles.brief }>INTERNAL USE ONLY</p> }
    { expanded && <p style={ styles.expanded }>INTERNAL USE ONLY - NOT FOR PUBLIC DISTRIBUTION</p> }
  </Fragment>
);

InternalUseDisplay.propTypes = {
  brief: PropTypes.bool,
  expanded: PropTypes.bool,
};

export default InternalUseDisplay;
