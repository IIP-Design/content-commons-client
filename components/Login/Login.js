import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import EmailLogin from './EmailLogin';
import GoogleLogin from './GoogleLogin';
import CloudflareLogin from './CloudflareLogin';

import './Login.scss';

const Login = props => {
  const { cfToken, email } = props;
  return (
    <div className="login login_wrapper">
      <h1>Log In</h1>
      { email
        && (
        <p className="login_subtext">
          Oops! Commons is taking longer than expected to load. Click below to continue or try refreshing the page.
        </p>
        ) }
      { email && <CloudflareLogin token={ cfToken } email={ email } /> }

      { !email
        && (
        <div>
          <p className="login_subtext">This workspace allows you to log in with your @america.gov Google account.</p>

          { /* Login via google */ }
          <GoogleLogin />
          <p className="login_subtext-note">By logging in you agree to our
            <Link href="/privacy"><a> Terms of Use</a>
            </Link> and <Link href="/privacy"><a>Privacy Policy</a></Link>.
          </p>

          <p className="login_optionText">Or</p>

          { /* Login via email/password */ }
          <EmailLogin />
        </div>
        ) }
    </div>
  );
};

Login.propTypes = {
  cfToken: PropTypes.string,
  email: PropTypes.string
};

export default Login;
