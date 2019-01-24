import React from 'react';
import PropTypes from 'prop-types';


const ApolloError = props => {
  const buttonStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '1rem'
  };

  const compileErrors = () => {
    const { error } = props;

    let errs = [];
    if ( error ) {
      const { graphQLErrors, networkError } = error;
      if ( graphQLErrors ) {
        errs = graphQLErrors.map( error => error.message );
      }
      if ( networkError ) {
        errs.push( networkError );
      }
    }

    return errs.join( '\n' );
  };


  return (
    <div style={ buttonStyle }>{ compileErrors() }</div>
  );
};

ApolloError.propTypes = {
  error: PropTypes.object
};

export default ApolloError;
