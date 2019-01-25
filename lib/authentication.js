import cookies from 'next-cookies';
import { Router } from 'next/router';

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

export const checkForAuthenticatedUser = ctx => {
  const { americaCommonsToken } = cookies( ctx );

  if ( !americaCommonsToken ) {
    redirectTo( '/login', { res: ctx.res } );
  }
};
