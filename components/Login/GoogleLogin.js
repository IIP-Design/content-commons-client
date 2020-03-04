import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { userLoggedIn } from 'lib/redux/actions/authentication';
import { GoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import getConfig from 'next/config';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../errors/AllError';

import { CURRENT_USER_QUERY } from '../User/User';
import './Login.scss';

const { publicRuntimeConfig } = getConfig();

const GOOGLE_SIGNIN_MUTATION = gql`
  mutation GOOGLE_SIGNIN_MUTATION( $token: String! ) {
    googleSignin( token: $token ) {
      email
    }
  }
`;

const GoogleLoginComponent = () => {
  const dispatch = useDispatch();
  const [googleError, setGoogleError] = useState( '' );
  const [accessToken, setAccessToken] = useState( '' );

  const failureGoogle = response => {
    const { error, details } = response;
    console.log( details );
    // do show an error if user closes window w/o logging in
    if ( error !== 'popup_closed_by_user' ) {
      setGoogleError( error );
    }
  };

  // Need to set state via function so that state is ready immediately
  const setToken = token => {
    setAccessToken( token );
    setGoogleError( '' );
  };

  // A catch block is needed to prevent a browser console error
  // as the mutate function returns a promise
  const willGoogleSignin = async googleSigninMutation => {
    try {
      await googleSigninMutation();
      Router.push( {
        pathname: '/'
      } );
      // redirect to dashboard
      /* eslint-disable no-empty */
    } catch ( err ) {}
  };

  return (
    <Mutation
      mutation={ GOOGLE_SIGNIN_MUTATION }
      variables={ { token: accessToken } }
      refetchQueries={ [{
        query: CURRENT_USER_QUERY,
        fetchPolicy: 'network-only',
        ssr: false
      }] }
    >
      { ( googleSignin, { loading, error } ) => (
        <div>
          { /* <ApolloError error={ error } /> */ }
          <Error error={ googleError } graphQLError={ error } />
          <GoogleLogin
            clientId={ publicRuntimeConfig.REACT_APP_GOOGLE_CLIENT_ID }
            render={ renderProps => (
              <Button loading={ loading } onClick={ renderProps.onClick }>Log in with America.gov</Button>
            ) }
            onSuccess={ async response => {
              // 1. Fetch token from google and set on state to send to mutation
              setToken( response.tokenId );

              // 2. Send google token server to verfiy and fetch User
              await willGoogleSignin( googleSignin );

              // 3. Set redux authenticated prop
              dispatch( userLoggedIn() );
            } }
            onFailure={ failureGoogle }
          />
        </div>
      ) }
    </Mutation>
  );
};

export default GoogleLoginComponent;
