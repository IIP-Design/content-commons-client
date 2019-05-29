import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import { validate } from 'lib/form';
import { CURRENT_USER_QUERY } from '../User/User';
import Error from '../errors/ApolloError';
import { getValidationSchema } from './validationSchema';
import './RegisterConfirmation.scss';

const UPDATE_PASSWORD_MUTATION = gql`
  mutation UPDATE_PASSWORD_MUTATION($tempToken: String!, $password: String!, $confirmPassword: String!) {
    updatePassword(tempToken: $tempToken, password: $password, confirmPassword: $confirmPassword) {
      id
    }
  }
`;

class ConfirmRegistration extends Component {
  render () {
    const {
      errors,
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
    } = this.props;


    return (
      <div className="confirm confirm_wrapper">
        <h1 className="confirm_title">Confirm Registration</h1>
        <p className="confirm_subtext">Create a password to complete your registration.</p>
        <Error error={ errors.submit } />
        <Form
          noValidate
          onSubmit={ handleSubmit }
        >
          <Form.Field>
            <Form.Input
              id="password"
              label="Password"
              name="password"
              type="password"
              value={ values.password }
              onChange={ handleChange }
              error={ !!errors.password }
              required
            />
            <p className="error-message">{ errors.password }</p>
          </Form.Field>
          <Form.Field>
            <Form.Input
              id="confirmPassword"
              label="Confirm Password"
              name="confirmPassword"
              type="password"
              value={ values.confirmPassword }
              onChange={ handleChange }
              error={ !!errors.confirmPassword }
              required
            />
            <p className="error-message">{ errors.confirmPassword }</p>
          </Form.Field>
          <Button
            type="submit"
            loading={ isSubmitting }
            disabled={ isSubmitting }
            className="primary"
          >Confirm Registration
          </Button>
        </Form>
      </div>
    );
  }
}

ConfirmRegistration.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool
};


export default compose(
  graphql( UPDATE_PASSWORD_MUTATION ),
  withFormik( {
    mapPropsToValues: () => ( {
      password: '',
      confirmPassword: ''
    } ),

    validate: validate( getValidationSchema ),
    validateOnBlur: false,
    validateOnChange: false,

    handleSubmit: async ( values, { props: { mutate, tempToken }, setErrors, setSubmitting } ) => {
      try {
        await mutate( {
          variables: {
            tempToken,
            password: values.password,
            confirmPassword: values.confirmPassword
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
)( ConfirmRegistration );
