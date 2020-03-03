import { LOGGED_IN, LOGGED_OUT } from '../constants';

export const userLoggedIn = () => ( {
  type: LOGGED_IN
} );

export const userLoggedOut = () => ( {
  type: LOGGED_OUT
} );
