/**
 * Handles the passing of file upload data to applicable component
 * Would have preferred to store in the Apollo Cache, but the file object
 * from the files input would not serialize properly
 * @todo Continue research to remove from redux when time permits
*/

import { ADD_FILES, CLEAR_FILES } from '../constants';

// reducer
const INITIAL_STATE = [];

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case ADD_FILES:
      return [...action.payload];

    case CLEAR_FILES:
      return [];

    default:
      return state;
  }
};
