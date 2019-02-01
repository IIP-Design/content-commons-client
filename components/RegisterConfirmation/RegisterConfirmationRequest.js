import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import Error from '../errors/ApolloError';
import './RegisterConfirmation.scss';

const REQUEST_ACCOUNT_ACTION_MUTATION = gql`
  mutation REQUEST_ACCOUNT_ACTION_MUTATION ( 
      $email: String!,
      $subject: String!,
      $body: String!,
      $link: String!,
      $reply: String!,
      $page: String! ) {
    requestAccountAction (
      email: $email,
      subject: $subject,
      body: $body,
      link: $link,
      reply: $reply,
      page: $page ) {
        text
      }
  }
`;

const validationSchema = Yup.object().shape( {
  email: Yup.string()
    .email( 'E-mail is not valid!' )
    .required( 'E-mail is required!' ),
} );

class RegisterConfirmationRequest extends Component {
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
        <h1 className="reset_title">Send Confirmation</h1>
        <p className="reset_subtext">Instructions confirm your registration will be sent to your email.</p>
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
          >Send Confirmation
          </Button>
        </Form>
      </div>
    );
  }
}

RegisterConfirmationRequest.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool
};


export default compose(
  graphql( REQUEST_ACCOUNT_ACTION_MUTATION ),
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
            email: values.email,
            subject: 'Confirm Your Account',
            body: 'Complete your registration by using the following link:',
            link: 'Complete your Registration',
            reply: 'A confirmation link has been sent to your enail',
            page: 'confirm'
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
)( RegisterConfirmationRequest );
