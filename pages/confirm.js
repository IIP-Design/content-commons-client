import React from 'react';
import PropTypes from 'prop-types';
import RegisterConfirmation from '../components/RegisterConfirmation/RegisterConfirmation';

const ConfirmPage = props => {
  if ( !props.query || !props.query.tempToken ) {
    return <div>Oops, this page has expired!</div>;
  }

  return (
    <RegisterConfirmation tempToken={ props.query.tempToken } />
  );
};


ConfirmPage.propTypes = {
  query: PropTypes.object
};


export default ConfirmPage;
