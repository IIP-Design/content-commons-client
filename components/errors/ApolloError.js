import React from 'react';
import PropTypes from 'prop-types';


const ApolloError = props => {
  const buttonStyle = {
    color: 'red',
    fontSize: '14px',
    marginBottom: '1rem'
  };

  return (
    <div>
      { props.error
        && (
          <div style={ buttonStyle }>{ props.error.graphQLErrors.map( ( { message }, i ) => (
            <div key={ i }>{ message }</div>
          ) ) }
          </div>
        )
      }
    </div>
  );
};

ApolloError.propTypes = {
  error: PropTypes.object
};

export default ApolloError;
