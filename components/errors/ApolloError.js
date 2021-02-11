import React from 'react';
import PropTypes from 'prop-types';
import { getApolloErrors } from 'lib/utils';


const ApolloError = props => {
  const buttonStyle = {
    color: 'red',
    fontSize: '14px',
    marginTop: '.5rem',
    marginBottom: '1rem',
  };

  const compileErrors = () => {
    const { error } = props;

    let errs = [];

    if ( error ) {
      errs = getApolloErrors( error );
    }

    if ( errs[0] === 'This token is either invalid or expired!' ) {
      return (
        <div>
          { 'Your link has expired. Please return to the ' }
          <a href="/login">login page</a>
          { /**/ }
          .
        </div>
      );
    }

    return errs.join( '\n' ).replace( 'AuthenticationError:', '' )
      .trim();
  };


  return (
    <div style={ buttonStyle }>
      { compileErrors() }
    </div>
  );
};

ApolloError.propTypes = {
  error: PropTypes.object,
};

export default ApolloError;
