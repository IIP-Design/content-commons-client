import React from 'react';
import PropTypes from 'prop-types';
import PasswordReset from 'components/PasswordReset/PasswordReset';
import PasswordResetRequest from 'components/PasswordReset/PasswordResetRequest';

const PasswordResetPage = props => {
  if ( !props.query || !props.query.tempToken ) {
    return <PasswordResetRequest />;
  }

  return (
    <PasswordReset tempToken={ props.query.tempToken } />
  );
};


PasswordResetPage.propTypes = {
  query: PropTypes.object
};


export default PasswordResetPage;
