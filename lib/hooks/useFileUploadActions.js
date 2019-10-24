import { useReducer } from 'react';
import { v4 } from 'uuid';

/**
 * Normalizes files to be added to state array.  For each file selected,
 * create/init a file object with applicable props & add.
 * Generate a file id to track changes to file
 * @param {array-like} files selected files from file selection dialogue
 */
const normalizeFiles = ( files, defaultUse ) => {
  let fileList = files;
  if ( !Array.isArray( fileList ) ) {
    fileList = Array.from( files );
  }

  return fileList.map( file => {
    const isFile = file instanceof File;

    // new file being added
    if ( isFile ) {
      return {
        id: v4(),
        name: file.name,
        language: '',
        use: defaultUse || '',
        quality: '',
        videoBurnedInStatus: '',
        input: file,
        loaded: 0
      };
    }

    // saved file being changed
    const {
      id, filename, language, quality, videoBurnedInStatus, use, url
    } = file;

    return {
      id,
      name: filename,
      language: language ? language.id : '',
      use: use ? use.id : '',
      quality,
      videoBurnedInStatus,
      url
    };
  } );
};

/**
 * Files that have already been saved to the db and had their assets uploaded to S3
 * need to be removed. A saved file will not have an input property
 * @param {array} filesToRemove
 * @param {object} file
 */
const updateFilesToRemove = ( filesToRemove, file ) => {
  if ( file && !file.input ) {
    return [...filesToRemove, file];
  }

  return [...filesToRemove];
};

const reducer = ( state, action ) => {
  const { files } = action;

  switch ( action.type ) {
    case 'ADD': {
      const { defaultUse } = action;
      const filesToAdd = normalizeFiles( files, defaultUse );
      return {
        ...state,
        files: [...state.files, ...filesToAdd]
      };
    }

    case 'REMOVE': {
      const { fileId } = action;
      const fileToRemove = state.files.find( file => file.id === fileId );

      return {
        files: state.files.filter( file => file.id !== fileId ),
        filesToRemove: updateFilesToRemove( state.filesToRemove, fileToRemove )
      };
    }

    case 'UPDATE': {
      const { data } = action;

      return {
        ...state,
        files: state.files.map( file => {
          if ( file.id !== data.id ) {
            return file;
          }
          return { ...file, [data.name]: data.value };
        } ),

      };
    }

    case 'RESET': {
      return {
        files: [],
        filesToRemove: []
      };
    }

    default:
      return state;
  }
};

export const useFileUploadActions = () => {
  const initialState = {
    files: [],
    filesToRemove: [],
  };

  const [state, dispatch] = useReducer( reducer, initialState );

  const reset = () => dispatch( { type: 'RESET' } );
  const updateFileField = data => dispatch( { type: 'UPDATE', data } );
  const addFiles = ( fileToBeAdded, defaultUse ) => dispatch( { type: 'ADD', files: fileToBeAdded, defaultUse } );
  const removeFile = fileId => dispatch( { type: 'REMOVE', fileId } );

  return {
    state,
    reset,
    updateFileField,
    addFiles,
    removeFile
  };
};
