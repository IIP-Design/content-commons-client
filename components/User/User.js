/**
 * Reusable component that returns an authenticated user
 */
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import PropTypes from 'prop-types';

const CURRENT_USER_QUERY = gql`
  query {
    authenticatedUser {
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
      }
    }
  }
`;

const User = props => (
  <Query { ...props } query={ CURRENT_USER_QUERY }>
    { payload => props.children( payload ) }
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
