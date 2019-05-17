
import { UPLOAD_ADD_FILES, UPLOAD_CLEAR_FILES, UPLOAD_PROGRESS } from '../constants';

export const uploadAddFiles = files => ( {
  type: UPLOAD_ADD_FILES,
  payload: files.map( file => ( { ...file, loaded: 0 } ) )
} );

export const uploadClearFiles = () => ( {
  type: UPLOAD_CLEAR_FILES
} );


export const uploadProgress = payload => ( {
  type: UPLOAD_PROGRESS,
  payload
} );
