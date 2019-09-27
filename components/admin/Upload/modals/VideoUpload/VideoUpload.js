import React, {
  useState, useEffect, Fragment
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/upload';
import { withRouter } from 'next/router';
import { compose, graphql } from 'react-apollo';
import { VIDEO_USE_QUERY, IMAGE_USE_QUERY } from 'components/admin/dropdowns/UseDropdown';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import { v4 } from 'uuid';
import { removeDuplicatesFromArray } from 'lib/utils';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import VideoProjectFiles from './VideoProjectFiles/VideoProjectFiles';
import './VideoUpload.scss';

export const VideoUploadContext = React.createContext();

const VideoUpload = props => {
  const [activeIndex, setActiveIndex] = useState( 0 );
  const [loading, setLoading] = useState( false );
  const [files, setFiles] = useState( [] );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );
  const [confirm, setConfirm] = useState( {} );

  useEffect( () => {
    // Check to see if all required dropdowns are completed
    // when the the files state changes. All fields do not need
    // to be checked as some are pre-populated on initialization or
    // not applicable. Submit button (Next) becomes active when all
    // complete
    const complete = files.every( file => {
      const { input: { type } } = file;
      if ( type.includes( 'video' ) ) {
        return ( file.language && file.videoBurnedInStatus && file.quality );
      }
      return ( file.language );
    } );

    setAllFieldsSelected( complete );
  }, [files] );

  // Store GraphQL id for each use default value
  // i.e. default use for video is 'Full Video'
  // id prop, not name used for mutation
  const defaultUse = {
    video: {
      id: '',
      name: 'Full Video',
      uses: props.videoData.videoUses
    },
    image: {
      id: '',
      name: 'Thumbnail/Cover Image',
      uses: props.imageData.imageUses
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

  const goNext = () => {
    setActiveIndex( 1 );
  };

  /**
   * Compares file object file names for use in sorting.
   * @param {object} a file object
   * @param {object} b file object
   * @returns {number}
   */
  const compareFilenames = ( a, b ) => a.input.name.localeCompare( b.input.name );

  const closeConfirm = () => {
    setConfirm( { open: false } );
  };

  const processDuplicates = filesToAdd => {
    try {
      const { duplicates, uniq } = removeDuplicatesFromArray( [...files, ...filesToAdd], 'input.name' );

      // if duplicates are present, ask user if they are indeed duplicates
      if ( duplicates ) {
        const dups = duplicates.reduce( ( acc, cur ) => `${acc} ${cur.input.name}\n`, '' );
        setConfirm( {
          open: true,
          headline: 'It appears that duplicate files are being added.',
          content: `Do you want to add these files?\n${dups}`,
          cancelButton: 'No, do not add files',
          confirmButton: 'Yes, add files',
          onCancel: () => {
            setFiles( uniq.sort( compareFilenames ) );
            closeConfirm();
          },
          onConfirm: () => {
            setFiles( [...filesToAdd, ...files].sort( compareFilenames ) );
            closeConfirm();
          }
        } );
      } else {
        setFiles( [...filesToAdd, ...files].sort( compareFilenames ) );
      }
    } catch ( err ) {
      console.error( err );
    }
  };


  /**
   * Add files to files state array.  For each file selected,
   * create/init a file object with applicable props & add.
   * Generate a file id to track changes to file
   * @param {array-like} filesFromInputSelection selected files from file selection dialogue
   */
  const addAssetFiles = filesFromInputSelection => {
    const fileList = Array.from( filesFromInputSelection );
    const filesToAdd = fileList.map( file => ( {
      language: '',
      use: getDefaultUse( file.type.substr( 0, file.type.indexOf( '/' ) ) ),
      quality: '',
      videoBurnedInStatus: '',
      input: file,
      id: v4(),
      loaded: 0
    } ) );

    // Only check for duplicates if there are current files to compare against
    if ( files.length ) {
      processDuplicates( filesToAdd );
    } else {
      setFiles( filesToAdd.sort( compareFilenames ) );
    }
  };

  /**
   * Prompt for removal confirmation and upon confirmation:
   * Remove file from files state array
   * @param {string} id id of file to remove
   */
  const removeAssetFile = id => {
    const file = files.find( f => f.id === id );
    if ( !file ) {
      console.error( 'File not found for removal.' );
    }

    setConfirm( {
      open: true,
      headline: 'Are you sure you want to remove this file?',
      content: `You are about to remove ${file.input.name}. This file will not be uploaded with this project.`,
      cancelButton: 'No, take me back',
      confirmButton: 'Yes, remove',
      onCancel: () => closeConfirm(),
      onConfirm: () => {
        setFiles( prevFiles => prevFiles.filter( f => f.id !== id ) );
        closeConfirm();
      }
    } );
  };

  /**
   * Replace file from files state array
   * @param {string} id id of file to replace
   * @param {array-like} fileFromInputSelection selected file from file selection dialogue
   */
  const replaceAssetFile = ( id, fileFromInputSelection ) => {
    setFiles( prevFiles => prevFiles.map( file => {
      if ( file.id !== id ) {
        return file;
      }
      return { ...file, input: fileFromInputSelection };
    } ).sort( compareFilenames ) );
  };

  /**
   * Update the files state with the selected value of an applicable file
   * updateField is called when a selection is made from a dropdown
   * Note: the name of field passed as param must match the state prop name
   * @param {object} e event object
   * @param {object} data data from selected field
   */
  const updateField = ( e, data ) => {
    setFiles( prevFiles => prevFiles.map( file => {
      if ( file.id !== data.id ) {
        return file;
      }
      return { ...file, [data.name]: data.value };
    } ) );
  };

  const gotoVideoEditPage = () => {
    props.router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        action: 'edit'
      }
    } );
  };

  /**
   * Called on submit. Saves applicabe file properties
   * to redux store. Object is then accessed from ProjectDetailsForm
   * in order to process upload
   * Note: would have preferred using Apollo cache but file object
   * would not serialize properly.
   * @todo Research issue when time permits
   */
  const handleAddFilesToUpload = async () => {
    setLoading( true );
    await props.uploadAddFiles( files ); // coming from redux
    gotoVideoEditPage();
  };

  const { updateModalClassname, closeModal } = props;
  const accept = '.srt, .mov, .mp4, .avi, .jpg, .png, .jpeg';

  /* eslint-disable react/display-name */
  const panes = [
    {
      menuItem: 'Create a Video Project',
      render: () => (
        <Tab.Pane>
          <VideoProjectType
            closeModal={ closeModal }
            goNext={ goNext }
            updateModalClassname={ updateModalClassname }
            addAssetFiles={ addAssetFiles }
            accept={ accept }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: '',
      render: () => (
        <Tab.Pane>
          <VideoUploadContext.Provider value={ {
            files,
            addAssetFiles,
            removeAssetFile,
            replaceAssetFile,
            updateField,
            allFieldsSelected,
            closeModal,
            handleAddFilesToUpload,
            accept
          } }
          >
            <VideoProjectFiles
              closeModal={ closeModal }
              updateModalClassname={ updateModalClassname }
            />
          </VideoUploadContext.Provider>
        </Tab.Pane>
      )
    }
  ];

  return (
    <Fragment>
      <Dimmer active={ loading } inverted>
        <Loader>Preparing files...</Loader>
      </Dimmer>

      <Tab
        activeIndex={ activeIndex }
        panes={ panes }
        className="videoUpload"
      />
      <DynamicConfirm { ...confirm } />
    </Fragment>
  );
};


VideoUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  videoData: PropTypes.shape( {
    videoUses: PropTypes.array
  } ),
  imageData: PropTypes.shape( {
    imageUses: PropTypes.array
  } ),
  router: PropTypes.object,
  uploadAddFiles: PropTypes.func // from redux
};

// @todo - add videoUseByName, imageUseByName queries to server
// as opposed to pulling whole list and filtering needed value
export default compose(
  withRouter,
  connect( null, actions ),
  graphql( VIDEO_USE_QUERY, { name: 'videoData' } ),
  graphql( IMAGE_USE_QUERY, { name: 'imageData' } )
)( VideoUpload );
