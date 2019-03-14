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
    padding: '1rem 1.75rem',
    backgroundColor: '#d6d7d9',
    textAlign: 'center'
  };

  const successStyles = {
    ...baseStyles,
    backgroundColor: '#aee02d',
    textAlign: 'initial',
    ...style
  };

  return (
    <p style={ successStyles }>
      <Icon size="large" name="check circle outline" />
      { ' ' }
      Files uploaded successfully!
    </p>
  );
};

UploadSuccessMsg.propTypes = {
  style: object
};

UploadSuccessMsg.defaultProps = {
  style: {}
};

export default UploadSuccessMsg;
