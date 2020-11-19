/* eslint-disable */
import getConfig from 'next/config';

const {
  publicRuntimeConfig: {
    REACT_APP_AWS_COGNITO_REGION,
    REACT_APP_AWS_COGNITO_USER_POOLS_ID,
    REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
    REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
    REACT_APP_AWS_COGNITO_CLIENT_DOMAIN,
    REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNIN,
    REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNOUT
  },
} = getConfig();

const awsconfig = {
  aws_project_region: REACT_APP_AWS_COGNITO_REGION,
  aws_cognito_region: REACT_APP_AWS_COGNITO_REGION,
  aws_cognito_identity_pool_id: REACT_APP_AWS_COGNITO_IDENTITY_POOL_ID,
  aws_user_pools_id: REACT_APP_AWS_COGNITO_USER_POOLS_ID,
  aws_user_pools_web_client_id: REACT_APP_AWS_COGNITO_USER_POOL_WEB_CLIENT_ID,
  oauth: {
    domain: REACT_APP_AWS_COGNITO_CLIENT_DOMAIN,
    scope: ['email', 'openid', 'profile', 'aws.cognito.signin.user.admin'],
    redirectSignIn: REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNIN,
    redirectSignOut: REACT_APP_AWS_COGNITO_CLIENT_REDIRECT_SIGNOUT,
    responseType: 'code',
  },
  federationTarget: 'COGNITO_USER_POOLS',
};
export default awsconfig;
