/**
 * Reusable component that returns an authenticated user
 */
import { gql } from '@apollo/client';
import PropTypes from 'prop-types';
import { Query } from '@apollo/client/react/components';

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
        contentTypes
      }
    }
  }
`;

const User = props => (
  <Query
    { ...props }
    query={ CURRENT_USER_QUERY }
    ssr={ false }
    fetchPolicy="network-only"
  >
    { payload => props.children( payload ) }
  </Query>
);

User.propTypes = {
  children: PropTypes.func.isRequired,
};

export default User;
export { CURRENT_USER_QUERY };
