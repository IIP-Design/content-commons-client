import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Button } from 'semantic-ui-react';
import getConfig from 'next/config';
import Router from 'next/router';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import Error from '../errors/AllError';

import { CURRENT_USER_QUERY } from '../User';
import './Login.scss';

const { publicRuntimeConfig } = getConfig();

const GOOGLE_SIGNIN_MUTATION = gql`
  mutation GOOGLE_SIGNIN_MUTATION( $token: String! ) {
    googleSignin( token: $token ) {
      email
    }
  }
`;

class GoogleLoginComponent extends Component {
  state = {
    googleError: '',
    accessToken: ''
  }

  failureGoogle = response => {
    console.log( 'Failed from client, sending to server for verification' );
    const { error } = response;

    // do show an error if user closes window w/o logging in
    if ( error !== 'popup_closed_by_user' ) {
      this.setState( {
        googleError: error
      } );
    }
  };

  // Need to set state via function so that state is ready immediately
  setToken = accessToken => {
    this.setState( () => ( { accessToken, googleError: '' } ) );
  }

  // A catch block is needed to prevent a browser console error
  // as the mutate function returns a promise
  willGoogleSignin = async googleSigninMutation => {
    try {
      await googleSigninMutation();
      Router.push( {
        pathname: '/'
      } );
      // redirect to dashboard
      /* eslint-disable no-empty */
    } catch ( err ) {}
  }


  render() {
    return (
      <Mutation
        mutation={ GOOGLE_SIGNIN_MUTATION }
        variables={ { token: this.state.accessToken } }
        refetchQueries={ [{ query: CURRENT_USER_QUERY }] }
      >
        { ( googleSignin, { loading, error } ) => {
          console.log( `Client : ${publicRuntimeConfig.REACT_APP_GOOGLE_CLIENT_ID}` );
          return (
            <div>
              { /* <ApolloError error={ error } /> */ }
              <Error error={ this.state.googleError } graphQLError={ error } />
              <GoogleLogin
                clientId={ publicRuntimeConfig.REACT_APP_GOOGLE_CLIENT_ID }
                render={ renderProps => (
                  <Button loading={ loading } onClick={ renderProps.onClick }>Log in with America.gov</Button>
                ) }
                onSuccess={ async response => {
                  // 1. Fetch token from google and set on state to send to mutation
                  this.setToken( response.tokenId );

                  // 2. Send google token server to verfiy and fetch User
                  await this.willGoogleSignin( googleSignin );
                } }
                onFailure={ this.failureGoogle }
              />
            </div>
          );
        }
      }
      </Mutation>
    );
  }
}

export default GoogleLoginComponent;
