/**
 * Handles the passing of file upload data to applicable component
 * Would have preferred to store in the Apollo Cache, but the file object
 * from the files input would not serialize properly
 * @todo Continue research to remove from redux when time permits
*/

import {
  UPLOAD_ADD_FILES, UPLOAD_RESET, UPLOAD_PROGRESS, IS_UPLOADING
} from '../constants';

// reducer
const INITIAL_STATE = {
  filesToUpload: [],
  isUploading: false
};

export default ( state = INITIAL_STATE, action ) => {
  switch ( action.type ) {
    case UPLOAD_ADD_FILES: {
      return {
        ...state,
        filesToUpload: [
          ...state.filesToUpload,
          ...action.payload
        ]
      };
    }


    case UPLOAD_RESET:
      return INITIAL_STATE;

    case UPLOAD_PROGRESS: {
      const {
        id, progress
      } = action.payload;

      const { filesToUpload } = state;

      return {
        ...state,
        filesToUpload: filesToUpload.map( file => {
          if ( file.id === id ) {
            file.loaded = progress;
          }
          return file;
        } )
      };
    }

    case IS_UPLOADING:
      return {
        ...state,
        isUploading: action.payload
      };

    default:
      return state;
  }
};
