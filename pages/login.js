import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/router';
import { useAuth } from 'context/authContext';
import Login from 'components/Login/Login';
import { isDevEnvironment } from 'lib/browser';
import { Loader } from 'semantic-ui-react';

const LoginPage = ( { redirect  } ) => {
  const router = useRouter();

  const { user, login, loading } = useAuth();

  // if we have a user, redirect
  if ( user ) {  
    const _redirect = redirect ? redirect : '/';  
    router.push( _redirect );
  }

  // if waiting on user, show loader
  if( loading ) {
    return (
      <div style={{ height: '30vh', paddingTop: '6rem' }}>
        <Loader size="medium" active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }

  // we do not have a user or are waiting on one
  // if in the loaal or dev environment, login with Google
  // as these environments do not have CloudFlare access
  if( isDevEnvironment() ) {
    return <Login />;
  } else {
    // login with CloudFlare
    login();
    return null;
  }
};


LoginPage.getInitialProps = async ( { res, status, asPath, query } ) => { 
  let re = /login\?return={1}(?<redirect>\/.+)$/;  
  let match = re.exec(asPath);   
  
  // return redirect url so user can be redirected clent side
  // after successful login and user obj is popluated
  return { redirect: match?.groups?.redirect };
}

export default LoginPage;
