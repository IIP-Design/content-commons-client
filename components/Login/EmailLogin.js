import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import Link from 'next/link';
import Router from 'next/router';
import { graphql, compose } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import ApolloError from '../errors/ApolloError';
import { CURRENT_USER_QUERY } from '../User/User';
import { validationSchema } from './validationSchema';
import './Login.scss';

const SIGNIN_MUTATION = gql`
  mutation SIGNIN_MUTATION( $email: String!, $password: String! ) {
    signIn( email: $email, password: $password ) {
      email
    }
  }
`;

class EmailLogin extends Component {
  render() {
    const {
      errors,
      values,
      isSubmitting,
      handleChange,
      handleSubmit
    } = this.props;

    return (
      <Form
        noValidate
        onSubmit={ handleSubmit }
      >
        <ApolloError error={ errors.submit } />
        <Form.Input
          id="email"
          label="Email"
          type="text"
          value={ values.email }
          onChange={ handleChange }
          placeholder="Your email address"
          error={ !!errors.email }
          required
        />
        <p className="error-message">{ errors.email }</p>
        <Form.Input
          id="password"
          label="Password"
          type="password"
          value={ values.password }
          onChange={ handleChange }
          placeholder="********"
          error={ !!errors.password }
          required
        />
        <p className="error-message">{ errors.password }</p>
        <div className="login_email">
          <div className="login_email--account resend">
            <p>Haven't received the confirmation email yet? <Link href="/confirm"><a>Resend the email?</a></Link></p>
          </div>
          <div className="login_email--button">
            <Button
              type="submit"
              disabled={ isSubmitting }
              loading={ isSubmitting }
            >Log in
            </Button>
          </div>
          <div className="login_email--account">
            <Link href="/passwordreset"><a>Forgot your password?</a></Link>
            <p>Don't have an account? <Link href="/register"><a>Register</a></Link></p>
          </div>
        </div>
      </Form>
    );
  }
}

EmailLogin.propTypes = {
  errors: PropTypes.object,
  values: PropTypes.object,
  isSubmitting: PropTypes.bool,
  handleChange: PropTypes.func,
  handleSubmit: PropTypes.func
};

export default compose(
  graphql( SIGNIN_MUTATION ),
  withFormik( {
    mapPropsToValues: () => ( {
      email: '',
      password: ''
    } ),

    validationSchema,
    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit: async ( values, { props: { mutate }, setSubmitting, setErrors } ) => {
      try {
        await mutate( {
          variables: {
            password: values.password,
            email: values.email
          },
          refetchQueries: [{ query: CURRENT_USER_QUERY }]
        } );

        // if confirmation is successful, send user to login screen
        Router.push( '/' );
      } catch ( err ) {
        setErrors( {
          submit: err
        } );
      }
      setSubmitting( false );
    }

  } )
)( EmailLogin );
