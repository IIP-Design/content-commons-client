import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  Form, Button, Modal, Header, Dimmer
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { useFileUploadActions } from 'lib/hooks/useFileUploadActions';
import Notification from 'components/Notification/Notification';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import { compose, graphql } from 'react-apollo';
import { VIDEO_USE_QUERY, IMAGE_USE_QUERY } from 'components/admin/dropdowns/UseDropdown';
import FileUploadProgressBar from '../FileUploadProgressBar/FileUploadProgressBar';

import './EditProjectFilesModal.scss';

const EditSupportFilesGrid = dynamic( () => import( /* webpackChunkName: "editSupportFilesGrid" */ './EditSupportFilesGrid/EditSupportFilesGrid' ) );
const EditVideoFilesGrid = dynamic( () => import( /* webpackChunkName: "editVideoFilesGrid" */ './EditVideoFilesGrid/EditVideoFilesGrid' ) );

export const FilesContext = React.createContext();

const EditProjectFilesModal = ( {
  title, type, filesToEdit, extensions,
  save, videoUses: { videoUses }
} ) => {
  const [open, setOpen] = useState( false );
  const [saving, setSaving] = useState( false );
  const [upload, setUpload] = useState( false );
  const [confirm, setConfirm] = useState( {} );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );
  const [step, setStep] = useState( 1 );

  const {
    state: { files, filesToRemove },
    reset,
    updateFileField,
    addFiles,
    removeFile
  } = useFileUploadActions();

  const allowedExtensions = extensions.join( ',' );

  const notificationStyles = {
    position: 'absolute',
    top: '15px',
    right: '40px'
  };

  const uploadProgessStyles = {
    margin: '-10px 15px 15px 15px'
  };

  /*
  Check to see if all required dropdowns are completed
  when the the files state changes. All fields do not need
  to be checked as some are pre-populated on initialization or
  not applicable. Save button becomes active when all
  complete
  */
  // checl allowed extensionx
  const isComplete = () => {
    if ( type === 'support' ) {
      return files.every( file => !!file.language );
    }
    return files.every( file => (
      !!file.language
      && !!file.videoBurnedInStatus
      && !!file.use
      && !!file.quality ) );
  };

  useEffect( () => {
    setAllFieldsSelected( isComplete() );
  }, [files] );

  const _addFiles = filesToAdd => {
    let defaultUse = '';
    if ( type === 'video' ) {
      defaultUse = videoUses.find( u => u.name === 'Full Video' );
    }

    addFiles( filesToAdd, defaultUse.id );
  };

  const compareFilenames = ( a, b ) => {
    try {
      return a.name.localeCompare( b.name );
    } catch ( err ) {
      console.log( err );
    }
  };

  const toggleStep = () => {
    setStep( s => ( s === 1 ? 2 : 1 ) );
  };

  const closeConfirm = () => {
    setConfirm( { open: false } );
  };

  const checkForDuplicates = ( currentFiles, filesToAdd ) => {
    try {
      const duplicates = filesToAdd.filter( file => currentFiles.includes( file.name ) );

      // if duplicates are present, ask user if they are indeed duplicates
      if ( duplicates.length ) {
        const dups = duplicates.reduce( ( acc, cur ) => `${acc} ${cur.name}\n`, '' );
        setConfirm( {
          open: true,
          headline: 'It appears that duplicate files are being added.',
          content: `Do you want to add these files?\n${dups}`,
          cancelButton: 'No, do not add files',
          confirmButton: 'Yes, add files',
          onCancel: () => {
            _addFiles( filesToAdd.filter( file => !currentFiles.includes( file.name ) ) );
            closeConfirm();
          },
          onConfirm: () => {
            _addFiles( filesToAdd );
            closeConfirm();
          }
        } );
      } else {
        _addFiles( filesToAdd );
      }
    } catch ( err ) {
      console.error( err );
    }
  };

  const closeModal = () => {
    setOpen( false );
    setStep( 1 );
    reset();
  };

  const openModal = () => {
    _addFiles( filesToEdit );
    setOpen( true );
  };

  const updateField = ( e, data ) => {
    updateFileField( data );
  };

  const showFileErrors = uploadedFileErrors => {
    const errors = uploadedFileErrors.reduce( ( acc, cur ) => `${acc} ${cur.name}\n`, '' );
    const multiple = ( uploadedFileErrors.length > 1 );
    setConfirm( {
      open: true,
      headline: `There was an error processing the following file ${multiple ? 's' : ''}`,
      content: errors,
      cancelButton: 'Close',
      confirmButton: 'OK',
      onCancel: () => {
        closeConfirm();
        closeModal();
      },
      onConfirm: () => {
        closeConfirm();
        closeModal();
      }
    } );
  };


  /**
   * Puts file in queue to remove
   * Only show confirm dialgue for files that have already been saved to db
   * For new files, the id is generated using uuid and therefore will
   * have the '-' character in it. Ff '-' exists, assume new file and do not show dialgue
   *
   * @param {string} id id of fiile
   * @param {string} name name of file
   */
  const handleRemove = ( id, name ) => {
    const matches = id.match( /-/gi );
    if ( !matches ) {
      setConfirm( {
        open: true,
        headline: 'The following file will be removed upon SAVE. Ok?',
        content: name,
        cancelButton: 'No, take me back',
        confirmButton: 'Yes, remove',
        onCancel: () => closeConfirm(),
        onConfirm: () => {
          removeFile( id );
          closeConfirm();
        }
      } );
    } else {
      removeFile( id );
    }
  };

  const handleAddFiles = e => {
    const filesToAdd = Array.from( e.target.files );
    if ( files.length ) {
      const currentFiles = files.map( file => file.name );
      checkForDuplicates( currentFiles, filesToAdd );
    } else {
      _addFiles( filesToAdd );
    }
  };

  const handleSave = async () => {
    setSaving( true );

    const uploadedFiles = files.filter( file => ( file.input ) );

    // if there are files to upload, show progress bar
    setUpload( uploadedFiles.length );

    await save( files, filesToRemove );
    setSaving( false );

    const uploadedFileErrors = uploadedFiles.filter( file => file.error );
    if ( uploadedFileErrors.length ) {
      showFileErrors( uploadedFileErrors );
    } else {
      closeModal();
    }
  };

  const renderGrid = () => {
    const sortedFiles = files.sort( compareFilenames );

    if ( type === 'support' ) {
      return (
        <EditSupportFilesGrid
          files={ sortedFiles }
          update={ updateField }
          removeFile={ handleRemove }
          accept={ allowedExtensions }
        />
      );
    }

    return (
      <EditVideoFilesGrid
        files={ sortedFiles }
        update={ updateField }
        removeFile={ handleRemove }
        accept={ allowedExtensions }
        step={ step }
      />
    );
  };

  return (
    <Modal
      open={ open }
      onClose={ closeModal }
      className="edit-support-files"
      size="small"
      closeOnDimmerClick={ !saving }
      trigger={ <Button className="btn--edit" onClick={ openModal } size="small" basic>Edit</Button> }
    >
      <Header content={ title } />

      { saving
        && (
          <Fragment>
            <Notification
              el="p"
              show
              icon
              customStyles={ notificationStyles }
              msg="Saving changes..."
            />

            { !!upload
            && (
            <FileUploadProgressBar
              filesToUpload={ files.filter( file => ( file.input ) ) }
              fileProgessMessage
              barSize="small"
              customStyles={ uploadProgessStyles }
            />
            )
            }
          </Fragment>
        )
      }

      <Dimmer.Dimmable dimmed={ saving }>
        <Dimmer inverted simple />

        <Modal.Content>
          <FilesContext.Provider value={ files }>
            <Form> { renderGrid() } </Form>
          </FilesContext.Provider>
        </Modal.Content>
        <Modal.Actions>
          <Button
            className="secondary alternative"
            content="Cancel"
            onClick={ closeModal }
          />

          <ButtonAddFiles
            onChange={ handleAddFiles }
            multiple
            accept={ allowedExtensions }
            className="secondary"
          >Add Files
          </ButtonAddFiles>

          { type === 'video' && (
          <Button
            className="secondary"
            type="button"
            content={ step === 1 ? 'Next' : 'Previous' }
            onClick={ toggleStep }
          />
          )
          }

          <Button
            className="primary"
            type="button"
            content="Save"
            onClick={ handleSave }
            disabled={ !allFieldsSelected }
          />
        </Modal.Actions>

      </Dimmer.Dimmable>
      <DynamicConfirm { ...confirm } />
    </Modal>
  );
};

EditProjectFilesModal.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  filesToEdit: PropTypes.array,
  extensions: PropTypes.array,
  videoUses: PropTypes.object,
  imageUses: PropTypes.object,
  save: PropTypes.func
};

export default compose(
  graphql( VIDEO_USE_QUERY, { name: 'videoUses' } ),
  graphql( IMAGE_USE_QUERY, { name: 'imageUses' } )
)( EditProjectFilesModal );
