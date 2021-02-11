import {
  UPLOAD_ADD_FILES, UPDATE_FILE_PROPS, UPLOAD_RESET, UPLOAD_PROGRESS, IS_UPLOADING,
} from '../constants';


export const uploadAddFiles = files => ( {
  type: UPLOAD_ADD_FILES,
  payload: files,
} );


export const uploadReset = () => ( {
  type: UPLOAD_RESET,
} );


export const uploadProgress = ( id, progress ) => ( {
  type: UPLOAD_PROGRESS,
  payload: {
    id,
    progress: progress.loaded,
  },
} );

export const updateFile = fileWithProps => ( {
  type: UPDATE_FILE_PROPS,
  payload: {
    fileWithProps,
  },
} );

export const setIsUploading = payload => ( {
  type: IS_UPLOADING,
  payload,
} );
