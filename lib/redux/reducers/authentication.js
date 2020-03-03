import { LOGGED_IN, LOGGED_OUT } from '../constants';

const initialState = {
  isLoggedIn: false
};

export default ( state = initialState, action ) => {
  switch ( action.type ) {
    case LOGGED_IN:
      return {
        ...state,
        isLoggedIn: true
      };
    case LOGGED_OUT:
      return {
        ...state,
        isLoggedIn: false
      };
    default:
      return state;
  }
};
