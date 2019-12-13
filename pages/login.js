import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Login from 'components/Login/Login';
import LogoutButton from 'components/Logout/Logout';
import User, { CURRENT_USER_QUERY } from 'components/User/User';
import { redirectTo } from 'lib/browser';
import cookies from 'next-cookies';
import jwt from 'jsonwebtoken';

import { CLOUDFLARE_SIGNIN_MUTATION } from 'components/Login/CloudflareLogin';

class LoginPage extends Component {
  static async getInitialProps ( ctx ) {
    const cooks = cookies( ctx );
    const cfAuth = cooks['CF_Authorization'];

    if ( cfAuth ) {
      await ctx.apolloClient
        .mutate( {
          mutation: CLOUDFLARE_SIGNIN_MUTATION,
          variables: { token: cfAuth },
          refetchQueries: [{ query: CURRENT_USER_QUERY }]
        } )
        .catch( err => console.dir( err ) );
      redirectTo( '/', ctx );
    }
    return { cookies: cooks };
  }

  detectCloudflare = () => {
    const cfAuth = this.props.cookies['CF_Authorization'];
    if ( cfAuth ) return cfAuth;
    return '';
  }

  decodeEmail = cfToken => {
    const decoded = jwt.decode( cfToken, { complete: true } );
    const email = ( decoded && decoded.payload ) ? decoded.payload.email : '';
    return email;
  }

  render() {
    const cfToken = this.detectCloudflare();
    const email = ( cfToken ) ? this.decodeEmail( cfToken ) : '';

    return (
      <User>
        {
          ( { data } ) => {
            const user = data ? data.authenticatedUser : null;
            if ( user ) {
              return (
                <div className="login login_wrapper">
                  <LogoutButton />
                </div>
              );
            }
            return <Login user={ user } cfToken={ cfToken } email={ email } />;
          }
        }
      </User>
    );
  }
}

LoginPage.propTypes = {
  cookies: PropTypes.object
};

export default LoginPage;
