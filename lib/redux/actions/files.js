
import { ADD_FILES, CLEAR_FILES } from '../constants';

export const addFiles = files => ( {
  type: ADD_FILES,
  payload: files
} );

export const clearFiles = () => ( {
  type: CLEAR_FILES
} );
