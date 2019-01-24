import React, { Component } from 'react';
import { GoogleLogin } from 'react-google-login';
import { Form, Button } from 'semantic-ui-react';
import Link from 'next/link';
import getConfig from 'next/config';
import Router from 'next/router';
import { Mutation, } from 'react-apollo';
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

class Login extends Component {
  state = {
    googleError: '',
    accessToken: ''
  }

  failureGoogle = response => {
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
      <div className="login login_wrapper">
        <h1>Log In</h1>
        <p className="login_subtext">This workspace allows you to log in with your @america.gov Google account.</p>

        { /* Login via google */ }
        <Mutation
          mutation={ GOOGLE_SIGNIN_MUTATION }
          variables={ { token: this.state.accessToken } }
          refetchQueries={ [{ query: CURRENT_USER_QUERY }] }
        >
          { ( googleSignin, { loading, error } ) => (
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
          )
           }
        </Mutation>
        <p className="login_subtext-note">By logging in you agree to our
          <Link href="/privacy"><a> Terms of Use</a>
          </Link> and <Link href="/privacy"><a>Privacy Policy</a></Link>.
        </p>

        { /* Login via email/password */ }
        <p className="login_optionText">Or</p>
        <Form>
          <Form.Input label="Email" type="text" placeholder="Your email address" />
          <Form.Input label="Password" type="password" placeholder="********" />
          <div className="login_email">
            <div className="login_email--button">
              <Button type="submit">Log in</Button>
            </div>
            <div className="login_email--account">
              <Link href="/forget"><a>Forgot your password?</a></Link>
              <p>Don't have an account? <Link href="/register"><a>Register</a></Link></p>
            </div>
          </div>
        </Form>
      </div>
    );
  }
}

export default Login;
