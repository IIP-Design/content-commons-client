
import {
  UPLOAD_ADD_FILES, UPLOAD_RESET, UPLOAD_PROGRESS, IS_UPLOADING
} from '../constants';

export const uploadAddFiles = files => ( {
  type: UPLOAD_ADD_FILES,
  payload: files.map( file => ( { ...file, loaded: 0 } ) )
} );

export const uploadClearFiles = () => ( {
  type: UPLOAD_RESET
} );

export const uploadProgress = ( id, progress ) => ( {
  type: UPLOAD_PROGRESS,
  payload: {
    id,
    progress: progress.loaded
  }
} );

export const setIsUploading = payload => ( {
  type: IS_UPLOADING,
  payload
} );
