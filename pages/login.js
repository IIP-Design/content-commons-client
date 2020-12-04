/* eslint-disable */
import React from 'react';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import cookies from 'next-cookies';
import { redirectTo } from 'lib/browser';
import Login from 'components/Login/Login'
 
/**
 * Takes a destructured object as a param containing:
 * @param redirect url to redirected to
 * @param code code that amplify sends on redirect after validation 
 */
const LoginPage = ( { redirect = '/', code } ) => {    
  // if code is defined then we are in the Commons signin process, show loader
  if ( code ) {
    return (
      <div style={{ height: '30vh', paddingTop: '6rem' }}>
        <Loader size="medium" active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }

  return  <Login redirect={ redirect } />
};

LoginPage.getInitialProps = async ( ctx ) => {  
  const  {req, asPath, isServer } = ctx;

  // if user is already logged in, redirect to home
  // TO Do: use Cognito token so only have to manage 1
  if( isServer ) {
    const { americaCommonsToken } = cookies( ctx );
    if ( americaCommonsToken ) {
      redirectTo( '/', ctx )
    }
  }

  // Check to see if this is a redirect after login
  // A 'return' query param is added to login url in _app if attempting
  // to access a protected page prior to authentication
  const re = /login\?return={1}(?<redirect>\/.+)$/;
  const match = re.exec( asPath );

  // Return redirect url to be passed to Cognito authentication as customState
  // The customState event is listened for in authContext via amplify Hub obj
  // The redirect happens when the customState event occurs
  // code is sent to indicate whether we are in sign in process -- will trigger the loading screen
  // if code !== undefined, we are in signin process (code is sent by amplify after successful login)
  return {
    redirect: match?.groups?.redirect,
    code: req?.query?.code
  };
};

LoginPage.propTypes = {
  redirect: PropTypes.string,
};

export default LoginPage;
