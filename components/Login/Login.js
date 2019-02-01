import React from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import EmailLogin from './EmailLogin';
import GoogleLogin from './GoogleLogin';
import LogoutButton from '../Logout/Logout';
import './Login.scss';

const Login = props => {
  // Need to fix this as it flashes when right before the redirect on login
  if ( props.user ) {
    return (
      <div className="login login_wrapper">
        <LogoutButton />
      </div>
    );
  }

  return (
    <div className="login login_wrapper">
      <h1>Log In</h1>
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
  );
};

Login.propTypes = {
  user: PropTypes.object
};

export default Login;
