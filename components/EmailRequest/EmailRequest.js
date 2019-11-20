import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Router from 'next/router';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import { Form, Button } from 'semantic-ui-react';
import * as Yup from 'yup';
import Error from '../errors/ApolloError';
import './EmailRequest.scss';

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
    .email( 'Email is not valid!' )
    .required( 'Email is required!' ),
} );

class EmailRequest extends Component {
  render () {
    const {
      errors,
      values,
      handleChange,
      handleSubmit,
      isSubmitting,
      title,
      instructions,
      button
    } = this.props;


    return (
      <div className="request request_wrapper">
        <h1 className="request_title">{ title }</h1>
        <p className="request_subtext">{ instructions }</p>
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
          >{ button }
          </Button>
        </Form>
      </div>
    );
  }
}

EmailRequest.propTypes = {
  values: PropTypes.object,
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  title: PropTypes.string,
  instructions: PropTypes.string,
  button: PropTypes.string,
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

    handleSubmit: async ( values, { props: { email, mutate }, setErrors, setSubmitting } ) => {
      try {
        await mutate( {
          variables: {
            email: values.email,
            subject: email.subject,
            body: email.body,
            link: email.link,
            reply: email.reply,
            page: email.page
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
)( EmailRequest );
