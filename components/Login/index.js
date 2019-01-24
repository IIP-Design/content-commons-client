import React from 'react';
import Link from 'next/link';
import EmailLogin from './EmailLogin';
import GoogleLogin from './GoogleLogin';
import './Login.scss';

const Login = () => (

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


export default Login;
