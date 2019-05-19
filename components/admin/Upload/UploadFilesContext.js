import React, { useReducer, useEffect } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { VIDEO_USE_QUERY, IMAGE_USE_QUERY } from 'components/admin/dropdowns/UseDropdown';
import { v4 } from 'uuid';

// Store GraphQL id for each use default value
// i.e. default use for video is 'Full Video'
// id prop, not name used for mutation
const defaultUse = {
  video: {
    id: '',
    name: 'Full Video',
    uses: []
  },
  image: {
    id: '',
    name: 'Thumbnail/Cover Image',
    uses: []
  }
};


/**
 * Pre-populate applicable default.  Default id is pulled from the respective use query
 * @param {string} type filetype
 */
const getDefaultUse = type => {
  // if there are no content uses for specifc type return
  const defaultContentUse = defaultUse[type];
  if ( !defaultContentUse ) {
    return '';
  }

  // if we already have a default id, return that
  if ( defaultContentUse.id ) {
    return defaultContentUse.id;
  }

  // look in the use list for a matching name, if found, set id or return ''
  const u = defaultContentUse.uses.find( use => use.name === defaultContentUse.name );
  if ( u ) {
    defaultContentUse.id = u.id;
    return defaultContentUse.id;
  }

  return '';
};

const add = files => files.map( file => ( {
  id: v4(),
  language: '',
  use: getDefaultUse( file.type.substr( 0, file.type.indexOf( '/' ) ) ),
  quality: '',
  videoBurnedInStatus: '',
  input: file
} ) );

const reducer = ( state, action ) => {
  switch ( action.type ) {
    case 'ADD_FILES': {
      const filesToAdd = add( action.payload );

      return ( {
        ...state,
        files: [
          ...state.files,
          ...filesToAdd
        ]
      } );
    }

    case 'REMOVE_FILE': {
      return ( {
        ...state,
        files: state.files.filter( file => action.payload !== file.id )
      } );
    }

    case 'REPLACE_FILE': {
      return ( {
        ...state,
        files: state.files.map( file => {
          if ( file.id !== action.payload.fileId ) {
            return file;
          }
          return { ...file, input: action.payload.fileFromInputSelection };
        } )
      } );
    }

    case 'UPDATE_FIELD': {
      const { id, name, value } = action.payload;
      return ( {
        ...state,
        files: state.files.map( file => {
          if ( file.id !== id ) {
            return file;
          }
          return { ...file, [name]: value };
        } )
      } );
    }

    case 'COMPLETE': {
      return ( {
        ...state,
        complete: action.payload
      } );
    }

    default:
      return state;
  }
};

const initialState = {
  files: [],
  complete: false
};

export const UploadFilesContext = React.createContext( initialState );

const UploadFilesProvider = props => {
  // set the use list for each content type
  defaultUse.video.uses = props.videoData.videoUses;
  defaultUse.image.uses = props.imageData.imageUses;

  const [{ files, complete }, dispatch] = useReducer( reducer, initialState );

  const addFiles = fileList => dispatch( {
    type: 'ADD_FILES',
    payload: Array.from( fileList )
  } );

  const removeFile = fileId => dispatch( {
    type: 'REMOVE_FILE',
    payload: fileId
  } );

  const replaceFile = ( fileId, fileFromInputSelection ) => dispatch( {
    type: 'REPLACE_FILE',
    payload: { fileId, fileFromInputSelection }
  } );

  const updateField = ( e, data ) => dispatch( {
    type: 'UPDATE_FIELD',
    payload: data
  } );

  useEffect( () => {
    // Check to see if all required dropdowns are completed
    // when the the files state changes. All fields do not need
    // to be checked as some are pre-populated on initialization or
    // not applicable.  Submit button (Next) becomes active when all
    // complete

    if ( files.length ) {
      const isComplete = files.every( file => {
        const { input: { type } } = file;
        if ( type.includes( 'video' ) ) {
          return ( file.language && file.videoBurnedInStatus && file.quality );
        }
        return ( file.language );
      } );

      dispatch( {
        type: 'COMPLETE',
        payload: isComplete
      } );
    }
  }, [files] );


  return (
    <UploadFilesContext.Provider value={ {
      files,
      complete,
      addFiles,
      removeFile,
      replaceFile,
      updateField
    } }
    >
      { props.children }
    </UploadFilesContext.Provider>
  );
};

UploadFilesProvider.propTypes = {
  children: PropTypes.node,
  videoData: PropTypes.shape( {
    videoUses: PropTypes.array
  } ),
  imageData: PropTypes.shape( {
    imageUses: PropTypes.array
  } )
};

export default compose(
  graphql( VIDEO_USE_QUERY, { name: 'videoData' } ),
  graphql( IMAGE_USE_QUERY, { name: 'imageData' } )
)( UploadFilesProvider );
