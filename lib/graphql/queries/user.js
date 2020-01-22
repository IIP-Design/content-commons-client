import gql from 'graphql-tag';

/*----------------------------------------
 Fragments
 -----------------------------------------*/
export const CURRENT_USER_DETAILS_FRAGMENT = gql`
  fragment currentUserDetails on User {
    id
    firstName
    lastName
    email
    jobTitle
    country
    city
    howHeard
    permissions
    team {
      id
      name
      contentTypes
    }
  }
`;

/*----------------------------------------
  Mutations
 -----------------------------------------*/
export const USER_SIGN_OUT_MUTATION = gql`
  mutation USER_SIGN_OUT_MUTATION {
    signOut
  }
`;


/*----------------------------------------
  Queries
 -----------------------------------------*/
// Fetches currently logged in user
export const CURRENT_USER_QUERY = gql`
  query CURRENT_USER_QUERY {
    user: authenticatedUser {
      ...currentUserDetails
    }
  }
  ${CURRENT_USER_DETAILS_FRAGMENT}
`;
