import React from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import {
  Form, List, Button
} from 'semantic-ui-react';
import { validationSchema } from './validationSchema';
import { permissionOptions } from '../permissionOptions';
import Error from '../../errors/ApolloError';

// UserCreateInput is a graphql input type defined in
// the prisma.graphql on the apollo server
const SIGNUP_MUTATION = gql`
  mutation SIGNUP_MUTATION( $data: UserCreateInput ) {
    signUp( data: $data ) {
      text
    }
}
`;

const ReviewSubmit = ( {
  errors,
  handleSubmit,
  handleChange,
  isSubmitting,
  goBack,
  user
} ) => {
  // Permissions data has only the value stored, i.e. EDITOR, so pull in option to
  // fetch label for display
  const role = permissionOptions.find( option => option.value === user.permissions );

  // Using user from state and NOT values from formik to popluate page as this is static info
  // and does not need validation
  return (
    <Form onSubmit={ handleSubmit }>
      <div style={ { marginBottom: '1rem' } }>Review and submit your information below to request a Content Commons account.</div>
      <List className="register_review">
        <List.Item><span><strong>Name:</strong></span>{ ' ' } { user.firstName }{ user.lastName }</List.Item>
        <List.Item><span><strong>Email:</strong></span>{ ' ' }{ user.email }</List.Item>
        <List.Item><span><strong>Role:</strong></span>{ ' ' }{ role.label }</List.Item>
        <List.Item><span><strong>Team:</strong></span>{ ' ' }{ user.team.name }</List.Item>
        <List.Item><span><strong>Job Title:</strong></span>{ ' ' }{ user.jobTitle }</List.Item>
      </List>
      <Form.Checkbox
        id="consent"
        name="consent"
        className="register_review-label"
        label="I agree to the Content Commons Terms of Use"
        onChange={ handleChange }
        error={ !!errors.consent }
      />
      <p className="error-message">{ errors.consent }</p>
      <div>
        <Error error={ errors.submit } />
        <div className="register_progress">
          <Button
            type="button"
            onClick={ goBack }
            disabled={ isSubmitting }
            className="secondary"
          >Previous
          </Button>
          <Button
            type="submit"
            loading={ isSubmitting }
            disabled={ isSubmitting }
            className="primary"
          >Submit
          </Button>
        </div>
      </div>
    </Form>
  );
};

ReviewSubmit.propTypes = {
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  goBack: PropTypes.func,
  user: PropTypes.object,
};


export default compose(
  graphql( SIGNUP_MUTATION, { name: 'signUp' } ),
  withFormik( {
    validationSchema,
    handleSubmit: async ( { user }, { props: { signUp, handleSignUpUserSuccess }, setErrors, setSubmitting } ) => {
      try {
        await signUp( {
        // data must conform to UserCreateInput using proper
        // data structure, i.e. setting enums or linking relationships
          variables: {
            data: {
              firstName: user.firstName,
              lastName: user.lastName,
              email: user.email,
              jobTitle: user.jobTitle,
              country: user.country,
              city: user.city,
              howHeard: user.howHeard,
              permissions: {
                set: [user.permissions]
              },
              team: {
                connect: {
                  id: user.team.id
                }
              }
            }
          }
        } );

        handleSignUpUserSuccess();
      } catch ( err ) {
        setErrors( {
          submit: err
        } );
      }

      setSubmitting( false );
    }
  } )
)( ReviewSubmit );
