import React from 'react';
import PropTypes from 'prop-types';
import RegisterConfirmation from 'components/RegisterConfirmation/RegisterConfirmation';
import RegisterConfirmationRequest from 'components/RegisterConfirmation/RegisterConfirmationRequest';

const ConfirmPage = props => {
  if ( !props.query || !props.query.tempToken ) {
    return <RegisterConfirmationRequest />;
  }

  return (
    <RegisterConfirmation tempToken={ props.query.tempToken } />
  );
};


ConfirmPage.propTypes = {
  query: PropTypes.object,
};


export default ConfirmPage;
