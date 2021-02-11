/**
 *
 * UploadSuccessMsg
 *
 */

import React from 'react';
import { object } from 'prop-types';
import { Icon } from 'semantic-ui-react';

const UploadSuccessMsg = props => {
  const { style } = props;
  const baseStyles = {
    margin: '0',
    padding: '0.3rem 1rem',
    backgroundColor: '#d6d7d9',
    textAlign: 'center',
    fontSize: '.77rem',
    fontWeight: 600,
  };

  const successStyles = {
    ...baseStyles,
    backgroundColor: '#aee02d',
    textAlign: 'initial',
    ...style,
  };

  const iconStyles = {
    fontSize: '1.2em',
    fontWeight: 600,
  };

  return (
    <p style={ successStyles }>
      <Icon name="check circle outline" style={ iconStyles } />
      { ' ' }
      Files uploaded successfully!
    </p>
  );
};

UploadSuccessMsg.propTypes = {
  style: object,
};

UploadSuccessMsg.defaultProps = {
  style: {},
};

export default UploadSuccessMsg;
