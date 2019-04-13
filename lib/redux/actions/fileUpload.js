
import { ADD_UPLOAD_FILES, CLEAR_UPLOAD_FILES } from '../constants';

export const addFilesToUpload = files => ( {
  type: ADD_UPLOAD_FILES,
  payload: files
} );

export const clearFiles = () => ( {
  type: CLEAR_UPLOAD_FILES
} );
