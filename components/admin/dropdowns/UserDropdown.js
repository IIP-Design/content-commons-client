import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { Form } from 'semantic-ui-react';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import './dropdown.scss';

const USERS_QUERY = gql`
  query USERS_QUERY {
    users {
      id
      firstName
      lastName
      email
      permissions
      team {
        id
        name
      }
    }
  }
`;


const UserDropdown = props => (
  <Query query={ USERS_QUERY }>
    { ( { data, loading, error } ) => {
      if ( error ) return `Error! ${error.message}`;

      let options = [];
      if ( data && data.users ) {
        options = data.users.map( user => ( { key: user.id, text: `${user.firstName} ${user.lastName}`, value: user.id } ) );
      }

      return (
        <Fragment>
          { !props.label && (

            <VisuallyHidden>
              <label htmlFor={ props.id }>
                { `${props.id} user` }
              </label>
            </VisuallyHidden>
          ) }

          <Form.Dropdown
            id={ props.id }
            name="user"
            options={ options }
            placeholder="–"
            loading={ loading }
            fluid
            selection
            { ...props }
          />
        </Fragment>
      );
    } }

  </Query>
);

UserDropdown.defaultProps = {
  id: ''
};


UserDropdown.propTypes = {
  id: PropTypes.string,
  label: PropTypes.string
};

export default UserDropdown;
export { USERS_QUERY };
