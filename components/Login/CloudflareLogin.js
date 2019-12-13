import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import Router from 'next/router';
import { useMutation } from '@apollo/react-hooks';
import gql from 'graphql-tag';
import Error from '../errors/AllError';

import { CURRENT_USER_QUERY } from '../User/User';
import './Login.scss';

const CLOUDFLARE_SIGNIN_MUTATION = gql`
  mutation CLOUDFLARE_SIGNIN_MUTATION( $token: String! ) {
    cloudflareSignin( token: $token ) {
      email
    }
  }
`;

const CloudflareLogin = props => {
  const [cfError, setCfError] = useState( '' );
  const [cloudflareSignin] = useMutation( CLOUDFLARE_SIGNIN_MUTATION );
  // A catch block is needed to prevent a browser console error
  // as the mutate function returns a promise
  const willCloudflareSignin = async cloudflareSigninMutation => {
    try {
      await cloudflareSigninMutation( {
        variables: { token: props.token },
        refetchQueries: [{ query: CURRENT_USER_QUERY }]
      } );
      Router.push( {
        pathname: '/'
      } );
    } catch ( err ) {
      setCfError( err.message );
    }
  };
  return (
    <div>
      <Error error={ cfError } />
      <Button
        onClick={
          async response => {
            await willCloudflareSignin( cloudflareSignin );
          }
        }
      >
        { `Continue as ${props.email}` }
      </Button>
    </div>
  );
};

CloudflareLogin.propTypes = {
  token: PropTypes.string,
  email: PropTypes.string
};

export default CloudflareLogin;
export { CLOUDFLARE_SIGNIN_MUTATION };
