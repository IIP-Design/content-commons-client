import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import Error from '../errors/ApolloError';
import './PasswordReset.scss';

const PASSWORD_RESET_REQUEST_MUTATION = gql`
  mutation PASSWORD_RESET_REQUEST_MUTATION($email: String! ) {
    passwordResetRequest(email: $email) {
      text
    }
  }
`;

const validationSchema = Yup.object().shape( {
  email: Yup.string()
    .email( 'E-mail is not valid!' )
    .required( 'E-mail is required!' ),
} );

class PasswordResetReqest extends Component {
  render () {
    const {
      errors,
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
    } = this.props;


    return (
      <div className="reset reset_wrapper">
        <h1 className="reset_title">Forgot your password?</h1>
        <p className="reset_subtext">Instructions to reset your password will be sent to your email.</p>
        <Error error={ errors.submit } />
        <Form
          noValidate
          onSubmit={ handleSubmit }
        >
          <Form.Field>
            <Form.Input
              id="email"
              label="Email"
              name="email"
              type="email"
              value={ values.email }
              onChange={ handleChange }
              error={ !!errors.email }
              required
            />
            <p className="error-message">{ errors.email }</p>
          </Form.Field>
          <Button
            type="submit"
            loading={ isSubmitting }
            disabled={ isSubmitting }
            className="primary"
          >Send Password Reset
          </Button>
        </Form>
      </div>
    );
  }
}

PasswordResetReqest.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool
};


export default compose(
  graphql( PASSWORD_RESET_REQUEST_MUTATION ),
  withFormik( {
    mapPropsToValues: () => ( {
      email: ''
    } ),

    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit: async ( values, { props: { mutate }, setErrors, setSubmitting } ) => {
      try {
        await mutate( {
          variables: {
            email: values.email
          }
        } );

        // after sending reset request, redirect to login screen
        Router.push( '/login' );
      } catch ( err ) {
        setErrors( {
          submit: err
        } );
      }
      setSubmitting( false );
    }
  } )
)( PasswordResetReqest );
