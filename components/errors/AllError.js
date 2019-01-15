import React, { Component } from 'react';
import PropTypes from 'prop-types';

class Error extends Component {
  compileErrors = () => {
    const { error, graphQLError } = this.props;

    let errors = [];
    if ( graphQLError ) {
      errors = graphQLError.graphQLErrors.map( error => error.message );
    }
    if ( error ) {
      errors.push( error );
    }

    return errors;
  };

  render () {
    const { error, graphQLError } = this.props;
    if ( !error && !graphQLError ) {
      return <div />;
    }

    const errors = this.compileErrors();

    const buttonStyle = {
      color: 'red',
      fontSize: '14px',
      marginBottom: '1rem'
    };

    return (
      <div style={ buttonStyle }>{ errors.map( ( error, i ) => <div key={ i }>{ error }</div> ) }
      </div>
    );
  }
}


Error.propTypes = {
  error: PropTypes.string,
  graphQLError: PropTypes.object
};

export default Error;
