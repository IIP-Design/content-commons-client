/**
 * Handles the passing of file upload data to applicable component
 * Would have preferred to store in the Apollo Cache, but the file object
 * from the files input would not serialize properly
 * @todo Continue research to remove from redux when time permits
*/

import { UPLOAD_ADD_FILES, UPLOAD_CLEAR_FILES, UPLOAD_PROGRESS } from '../constants';

// reducer
const INITIAL_STATE = {
  filesToUpload: []
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case UPLOAD_ADD_FILES:
      return {
        filesToUpload: [...action.payload]
      };

    case UPLOAD_CLEAR_FILES:
      return {
        filesToUpload: []
      };

    case UPLOAD_PROGRESS:
      return state.filesToUpload.map( file => {
        if ( file.id === action.payload.id ) {
          file.loaded = action.payload.loaded;
        }
        return file;
      } );

    default:
      return state;
  }
};
