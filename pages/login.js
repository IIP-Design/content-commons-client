import React from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { Loader } from 'semantic-ui-react';

import Login from 'components/Login/Login';
import { useAuth } from 'context/authContext';
import { isDevEnvironment } from 'lib/browser';

const LoginPage = ( { redirect } ) => {
  const router = useRouter();

  const { user, login, loading } = useAuth();

  // if we have a user, redirect
  if ( user && user.id !== 'public' ) {
    const _redirect = redirect || '/';

    router.push( _redirect );
  }

  // if waiting on user, show loader
  if ( loading ) {
    return (
      <div style={ { height: '30vh', paddingTop: '6rem' } }>
        <Loader size="medium" active inline="centered">
          Loading
        </Loader>
      </div>
    );
  }

  // we do not have a user or are waiting on one
  // if in the local or dev environment, login with Google
  // as these environments do not have CloudFlare access
  if ( isDevEnvironment() ) {
    return <Login />;
  }
  // login with CloudFlare
  login();

  return null;
};

LoginPage.getInitialProps = async ( { res, status, asPath, query } ) => {
  const re = /login\?return={1}(?<redirect>\/.+)$/;
  const match = re.exec( asPath );

  // return redirect url so user can be redirected client side
  // after successful login and user obj is populated
  return { redirect: match?.groups?.redirect };
};

LoginPage.propTypes = {
  redirect: PropTypes.string,
};

export default LoginPage;
