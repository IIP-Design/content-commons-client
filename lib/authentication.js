
import Router from 'next/router';
import { CURRENT_USER_QUERY } from '../components/User';

export const redirectTo = ( destination, { res, status } ) => {
  if ( res ) {
    res.writeHead( status || 302, {
      Location: destination
    } );
    res.end();
  } else {
    Router.push( destination );
  }
};

export const isRestrictedPage = path => path.indexOf( '/admin/' ) !== -1;

export const checkForAuthenticatedUser = ( { apolloClient, res } ) => {
  apolloClient.query( { query: CURRENT_USER_QUERY } ).then( ( { data } ) => data ).catch( err => {
    redirectTo( '/login', { res } );
  } );
};
