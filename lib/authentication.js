import { CURRENT_USER_QUERY } from 'components/User/User';

export const isRestrictedPage = path => path.indexOf( '/admin/' ) !== -1;

export const checkForAuthenticatedUser = async apolloClient => {
  try {
    const response = await apolloClient.query( { query: CURRENT_USER_QUERY, ssr: false, fetchPolicy: 'network-only' } );
    const { data: { authenticatedUser } } = response;
    return authenticatedUser;
  } catch ( err ) {
    console.log( 'Error: Unable to fetch authenticated user' );
  }
};
