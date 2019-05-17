import React, { useState, useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/fileUpload';
import { withRouter } from 'next/router';
import { compose, graphql } from 'react-apollo';
import { VIDEO_USE_QUERY, IMAGE_USE_QUERY } from 'components/admin/dropdowns/UseDropdown';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import { v4 } from 'uuid';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import VideoProjectFiles from './VideoProjectFiles/VideoProjectFiles';
import './VideoUpload.scss';

export const VideoUploadContext = React.createContext();

const VideoUpload = props => {
  const [activeIndex, setActiveIndex] = useState( 0 );
  const [loading, setLoading] = useState( false );
  const [files, setFiles] = useState( [] );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );

  // Store GraphQL id for each use default
  // i.e. default use for video is 'Full Video'
  // id, not name used for mutation
  let videoUseDefaultId = '';
  let imageUseDefaultId = '';

  useEffect( () => {
    // Check to see if all required dropdowns are completed
    // when the the files state changes. All fields do not need
    // to be checked as some are pre-populated on initialization or
    // not applicable.  Submit button (Next) becomes active when all
    // complete
    const complete = files.every( file => {
      const { fileInput: { type } } = file;
      if ( type.includes( 'video' ) ) {
        return ( file.language && file.videoBurnedInStatus && file.quality );
      }
      return ( file.language );
    } );

    setAllFieldsSelected( complete );
  }, [files] );

  /**
   * Pre-populate applicable default.  Default id is pulled from the respective use query
   * @param {string} type filetype
   */
  const getUse = type => {
    const { videoUseData: { videoUses }, imageUseData: { imageUses } } = props;

    if ( type.includes( 'video' ) ) {
      if ( !videoUseDefaultId ) {
        const videoUseDefault = videoUses.find( use => use.name === 'Full Video' );
        if ( videoUseDefault ) {
          videoUseDefaultId = videoUseDefault.id;
        }
      }
      return videoUseDefaultId;
    }

    if ( type.includes( 'image' ) ) {
      if ( !imageUseDefaultId ) {
        const imageUseDefault = imageUses.find( use => use.name === 'Thumbnail/Cover Image' );
        if ( imageUseDefault ) {
          imageUseDefaultId = imageUseDefault.id;
        }
      }
      return imageUseDefaultId;
    }

    return '';
  };

  const goNext = () => {
    setActiveIndex( 1 );
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
      use: getUse( file.type ),
      quality: '',
      videoBurnedInStatus: '',
      fileInput: file,
      id: v4()
    } ) );

    const reduceDuplicates = ( arr, file ) => {
      if ( !arr.find( file2 => file.fileInput.name === file2.fileInput.name ) ) {
        arr.push( file );
      }
      return arr;
    };
    setFiles( prevFiles => [...prevFiles, ...filesToAdd].reduce( reduceDuplicates, [] ) );
  };

  /**
   * Remove file from files state array
   * @param {string} id id of file to remove
   */
  const removeAssetFile = id => {
    setFiles( prevFiles => prevFiles.filter( file => file.id !== id ) );
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
      return { ...file, fileInput: fileFromInputSelection };
    } ) );
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

  // @todo complete wiring before activating router
  const gotoVideoEditPage = () => {
    // props.router.push( {
    //   pathname: '/admin/project',
    //   query: {
    //     content: 'video',
    //     action: 'edit'
    //   }
    // } );
  };

  /**
   * Called on submit. Saves applicabe file properties
   * to redux store. Object is then accessed from ProjectDataForm
   * in order to process upload
   * Note: would have preferred using Apollo cache but file object
   * would not serialize properly.
   * @todo Research issue when time permits
   */
  const handleAddFilesToUpload = async () => {
    setLoading( true );
    const filesToUpload = files.map( file => ( {
      language: file.language,
      use: file.use,
      quality: file.quality,
      videoBurnedInStatus: file.videoBurnedInStatus,
      fileObject: file.fileInput
    } ) );

    await props.addFilesToUpload( filesToUpload ); // coming from redux
    gotoVideoEditPage();
  };


  const { updateModalClassname, closeModal } = props;

  /* eslint-disable react/display-name */
  const panes = [
    {
      menuItem: 'Upload Files',
      render: () => (
        <Tab.Pane>
          <VideoProjectType
            closeModal={ closeModal }
            goNext={ goNext }
            updateModalClassname={ updateModalClassname }
            addAssetFiles={ addAssetFiles }
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
            handleAddFilesToUpload
          } }
          >
            <VideoProjectFiles
              closeModal={ closeModal }
              goNext={ goNext }
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
    </Fragment>
  );
};


VideoUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  videoUseData: PropTypes.shape( {
    videoUses: PropTypes.array
  } ),
  imageUseData: PropTypes.shape( {
    imageUses: PropTypes.array
  } ),
  // router: PropTypes.object,
  addFilesToUpload: PropTypes.func // from redux
};

// @todo - add videoUseByName, imageUseByName queries to server
// as opposed to pulling whole list and filtering needed value
export default compose(
  withRouter,
  connect( null, actions ),
  graphql( VIDEO_USE_QUERY, { name: 'videoUseData' } ),
  graphql( IMAGE_USE_QUERY, { name: 'imageUseData' } )
)( VideoUpload );
