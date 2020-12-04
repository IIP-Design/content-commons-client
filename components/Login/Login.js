import React from 'react';
import PropTypes from 'prop-types';
import { Button } from 'semantic-ui-react';
import { Auth } from 'aws-amplify';
import googleIcon from 'static/icons/icon_google.svg';
import oktaIcon from 'static/icons/icon_okta.svg';
import getConfig from 'next/config';
import './Login.scss';

const {
  publicRuntimeConfig: { REACT_APP_AWS_COGNITO_OKTA_PROVIDER_NAME },
} = getConfig();

/**
 * functiom takes a destructured object as a param containing:
 * @param redirect url to redirected to after login
 */
const Login = ( { redirect } ) => (
  <div className="login">
    <div className="login_form">
      <h1>Log In</h1>
      <p>Content publishers should sign in using their america.gov accounts.</p>

      {/* Login via google (america.gov) */}
      <Button
        className="btn secondary"
        onClick={ () => Auth.federatedSignIn( { provider: 'Google', customState: redirect } ) }
      >
        <img src={ googleIcon } alt="Log in with America.gov" width="24" />
        {' '}
        Log in with America.gov
      </Button>

      <div className="or">or</div>

      {/* Login via okta */}
      <Button
        className="btn primary"
        onClick={ () => Auth.federatedSignIn( {
          provider: REACT_APP_AWS_COGNITO_OKTA_PROVIDER_NAME,
          customState: redirect,
        } ) }
      >
        <img src={ oktaIcon } alt=" Okta Single Sign-On" width="24" />
        {' '}
        Okta Single Sign-On
      </Button>
    </div>
    <div className="login_offical">
      <p className="warning">Warning: For Official Use Only!</p>
      <p>
        You are accessing a U.S. Government information system, which includes (1) this computer,
        (2) this computer network, (3) all computers connected to this network and (4) all devices
        and storage media attached to this network or to a computer on this network.
      </p>
      <p>
        This information system is provided for U.S. Government-authorized use only. Unauthorized or
        improper use of this system may result in disciplinary action, as well as civil and criminal
        penalties. By using this information system, you understand and consent to the following:
      </p>
      <p>
        *You have no reasonable expectation of privacy regarding any communications or data
        transiting or stored on this information system. At any time, and for any lawful government
        purpose, the government may monitor, intercept, and search and seize any communication or
        data transiting or stored on this information system.
      </p>
      <p>
        *Any communications or data transiting or stored on this information system may be disclosed
        or used for any lawful government purpose.
      </p>
      <p>
        Nothing herein consents to the search or seizure of a privately-owned computer or other
        privately owned communications device, or the contents thereof, that is in the system user’s
        home.
      </p>
      <p>
        Opening e-mails from unknown/unconfirmed websites may open the Department’s system to
        malware.
      </p>
    </div>
  </div>
);


Login.propTypes = {
  redirect: PropTypes.string,
};

export default Login;
