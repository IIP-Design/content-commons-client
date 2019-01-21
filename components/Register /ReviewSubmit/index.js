import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import {
  Form, List, Button
} from 'semantic-ui-react';
import { validationSchema } from './validationSchema';
import { permissionOptions } from '../permissionOptions';
import Error from '../../errors/ApolloError';


// const SIGNUP_MUTATION = gql`
//   mutation SIGNUP_MUTATION(
//     $firstName: String!
//     $lastName: String!
//     $email: String!
//     $jobTitle: String
//     $country: String
//     $city: String
//     $howHeard: String
//     $permissions: [Permission]
//     $teamId: String!
//     ) {
//      signUp(
//       firstName: $firstName
//       lastName: $lastName
//       email: $email
//       jobTitle: $jobTitle
//       country: $country
//       city: $city
//       howHeard: $howHeard
//       permissions: $permissions
//       teamId: $teamId
//      ) {
//        text
//      }
//   }
// `;

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
  isValid,
  handleSignUpUserSuccess,
  goBack,
  user
} ) => {
  // Permissions data has only the value stored, i.e. EDITOR, so pull in option to
  // fetch label for display
  const role = permissionOptions.find( option => option.value === user.permissions );

  // Using user from state and NOT values from formik to popluate page as this is static info
  // and does not need validation
  return (
    <Form>
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
      <Mutation
        mutation={ SIGNUP_MUTATION }
        variables={ {
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
        } }
      >
        {
           ( signUp, { data, loading, error } ) => {
             if ( data && data.signUp && data.signUp.text ) {
               handleSignUpUserSuccess();
               return <div />;
             }
             return (
               <div>
                 <Error error={ error } />
                 <div className="register_progress">
                   <Button
                     type="button"
                     onClick={ goBack }
                     disabled={ isSubmitting }
                     className="secondary"
                   >Previous
                   </Button>
                   <Button
                     onClick={ () => {
                       if ( isValid ) {
                         signUp().catch( err => {} );
                       } else {
                         handleSubmit();
                       }
                     } }
                     type="submit"
                     loading={ loading }
                     disabled={ isSubmitting }
                     className="primary"
                   >Submit
                   </Button>
                 </div>
               </div>
             );
           }
        }
      </Mutation>
    </Form>
  );
};

ReviewSubmit.propTypes = {
  errors: PropTypes.object,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  handleSignUpUserSuccess: PropTypes.func,
  goBack: PropTypes.func,
  user: PropTypes.object,
};

export default withFormik( {
  validationSchema
} )( ReviewSubmit );
