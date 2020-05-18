import { useReducer } from 'react';

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
      return {
        ...state,
        files: [...state.files, ...files],
      };
    }

    case 'REMOVE': {
      const { fileId } = action;
      const fileToRemove = state.files.find( file => file.id === fileId );

      return {
        files: state.files.filter( file => file.id !== fileId ),
        filesToRemove: updateFilesToRemove( state.filesToRemove, fileToRemove ),
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
        filesToRemove: [],
      };
    }

    default:
      return state;
  }
};

/**
 * Hook that manages file state array for files CRUD operations
 * @param {function} normalizeFn function that normalizes added files into appropriate content data structure
 *  @param {array} files Files to initialize state
 */
export const useFileStateManger = ( normalizeFn, files = [] ) => {
  const initialState = {
    files,
    filesToRemove: [],
  };

  const [state, dispatch] = useReducer( reducer, initialState );

  // START - maintain for backward compatibility
  const reset = () => dispatch( { type: 'RESET' } );

  const updateFileField = data => dispatch( { type: 'UPDATE', data } );

  const addFiles = ( fileToBeAdded, defaultUse ) => dispatch( {
    type: 'ADD',
    files: normalizeFn( fileToBeAdded, defaultUse ),
  } );

  const removeFile = fileId => dispatch( { type: 'REMOVE', fileId } );
  // END - maintain for backward compatibility

  return {
    state,
    dispatch,
    reset,
    updateFileField,
    addFiles,
    removeFile,
  };
};
