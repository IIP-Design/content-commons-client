import React from 'react';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button } from 'semantic-ui-react';
import { CURRENT_USER_QUERY } from '../User/User';


const SIGN_OUT_MUTATION = gql`
  mutation SIGN_OUT_MUTATION {
    signOut
  }
`;

const Logout = props => (
  <Mutation
    mutation={ SIGN_OUT_MUTATION }
    refetchQueries={ [{ query: CURRENT_USER_QUERY }] }
  >
    { signOut => (
      <Button
        { ...props }
        onClick={ async () => {
          await signOut();
        } }
      >Logout
      </Button>
    ) }
  </Mutation>
);


export default Logout;
