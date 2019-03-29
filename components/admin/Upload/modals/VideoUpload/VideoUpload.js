import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Tab
} from 'semantic-ui-react';
import { v4 } from 'uuid';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import VideoProjectFiles from './VideoProjectFiles/VideoProjectFiles';
import './VideoUpload.scss';

const VideoUpload = props => {
  const [activeIndex, setActiveIndex] = useState( 0 );
  const [files, setFiles] = useState( [] );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );

  useEffect( () => {
    // check to see if all required dropdowns are completed
    // when the the files state changes. All fields do not need
    // to be checked as they are pre-populated on initialization or
    // not applicable
    const complete = files.every( file => {
      const { fileInput: { type } } = file;
      if ( type.includes( 'video' ) ) {
        return ( file.language && file.videoBurnedinStatus && file.quality );
      }
      return ( file.language );
    } );

    setAllFieldsSelected( complete );
  }, [files] );

  /**
   * Pre-poulate fields
   * @param {string} type filetype
   */
  const getUse = type => {
    if ( type.includes( 'video' ) ) {
      return 'Full Video';
    } if ( type.includes( 'image' ) ) {
      return 'Thumbnail/Cover Image';
    }
    return '';
  };

  const goNext = () => {
    setActiveIndex( 1 );
  };


  const addAssetFiles = filesFromInputSelection => {
    const fileList = Array.from( filesFromInputSelection );

    const filesToAdd = fileList.map( file => ( {
      language: '',
      use: getUse( file.type ),
      quality: '',
      videoBurnedinStatus: '',
      fileInput: file,
      id: v4()
    } ) );
    setFiles( prevFiles => [...prevFiles, ...filesToAdd] );
  };

  const removeAssetFile = id => {
    setFiles( prevFiles => prevFiles.filter( file => file.id !== id ) );
  };

  const replaceAssetFile = ( id, fileFromInputSelection ) => {
    setFiles( prevFiles => prevFiles.map( file => {
      if ( file.id !== id ) {
        return file;
      }
      return { ...file, fileInput: fileFromInputSelection };
    } ) );
  };

  /**
   * Update the files state with the selected value.
   * Note: the nameof field passed as param must match the state prop name
   * @param {object} e event object
   * @param {object} data data from selected field
   * @param {string} field name of dropdown
   */
  const updateField = ( e, data, field ) => {
    setFiles( prevFiles => prevFiles.map( file => {
      if ( file.id !== data.id ) {
        return file;
      }
      return { ...file, [field]: data.value };
    } ) );
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
          <VideoProjectFiles
            closeModal={ closeModal }
            goNext={ goNext }
            updateModalClassname={ updateModalClassname }
            files={ files }
            addAssetFiles={ addAssetFiles }
            removeAssetFile={ removeAssetFile }
            replaceAssetFile={ replaceAssetFile }
            updateField={ updateField }
            allFieldsSelected={ allFieldsSelected }
          />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Tab
      activeIndex={ activeIndex }
      panes={ panes }
      className="videoUpload"
    />
  );
};


VideoUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default VideoUpload;
