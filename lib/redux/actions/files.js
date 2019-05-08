
import { ADD_FILES, CLEAR_FILES, UPLOAD_PROGRESS } from '../constants';

export const addFiles = files => ( {
  type: ADD_FILES,
  payload: files
} );

export const clearFiles = () => ( {
  type: CLEAR_FILES
} );


export const uploadProgress = payload => ( {
  type: UPLOAD_PROGRESS,
  payload
} );
