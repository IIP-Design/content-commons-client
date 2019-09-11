import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  Form, Button, Modal, Header, Dimmer
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { useFileUploadActions } from 'lib/hooks/useFileUploadActions';
import Notification from 'components/Notification/Notification';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';

import './EditProjectFilesModal.scss';

const EditSupportFilesGrid = dynamic( () => import( /* webpackChunkName: "editSupportFilesGrid" */ './EditSupportFilesGrid/EditSupportFilesGrid' ) );
const EditVideoFilesGrid = dynamic( () => import( /* webpackChunkName: "editVideoFilesGrid" */ './EditVideoFilesGrid/EditVideoFilesGrid' ) );

const EditProjectFilesModal = ( {
  title, type, filesToEdit, extensions, save
} ) => {
  const [open, setOpen] = useState( false );
  const [saving, setSaving] = useState( false );
  const [confirm, setConfirm] = useState( {} );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );
  const [step, setStep] = useState( 1 );

  const {
    state: { files, filesToRemove },
    reset,
    updateFileField,
    addFiles,
    removeFile,
    replaceFile
  } = useFileUploadActions();

  const allowedExtensions = extensions.join( ',' );

  const notificationStyles = {
    position: 'absolute',
    top: '15px',
    right: '40px'
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


  const compareFilenames = ( a, b ) => {
    try {
      return a.name.localeCompare( b.name );
    } catch ( err ) {
      console.log( err );
    }
  };

  const toggleStep = () => {
    setStep( s => ( s === 1 ? 2 : 1 ) );
    console.log( `step ${step}` );
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
            addFiles( filesToAdd.filter( file => !currentFiles.includes( file.name ) ) );
            closeConfirm();
          },
          onConfirm: () => {
            addFiles( filesToAdd );
            closeConfirm();
          }
        } );
      } else {
        addFiles( filesToAdd );
      }
    } catch ( err ) {
      console.error( err );
    }
  };

  const closeModal = () => {
    setOpen( false );
    reset();
  };

  const openModal = () => {
    addFiles( filesToEdit );
    setOpen( true );
  };

  const updateField = ( e, data ) => {
    updateFileField( data );
  };

  const handleRemove = ( id, name ) => {
    setConfirm( {
      open: true,
      headline: 'Are you sure you want to remove this file?',
      content: `You are about to remove ${name}`,
      cancelButton: 'No, take me back',
      confirmButton: 'Yes, remove',
      onCancel: () => closeConfirm(),
      onConfirm: () => {
        removeFile( id );
        closeConfirm();
      }
    } );
  };

  const handleAddFiles = e => {
    const filesToAdd = Array.from( e.target.files );
    if ( files.length ) {
      const currentFiles = files.map( file => file.name );
      checkForDuplicates( currentFiles, filesToAdd );
    } else {
      addFiles( filesToAdd );
    }
  };

  const handleSave = async () => {
    setSaving( true );
    await save( files, filesToRemove );
    setSaving( false );
    closeModal();
  };

  const renderGrid = () => {
    const sortedFiles = files.sort( compareFilenames );

    if ( type === 'support' ) {
      return (
        <EditSupportFilesGrid
          files={ sortedFiles }
          update={ updateField }
          removeFile={ handleRemove }
          replaceFile={ replaceFile }
          accept={ allowedExtensions }
        />
      );
    }

    return (
      <EditVideoFilesGrid
        files={ sortedFiles }
        update={ updateField }
        removeFile={ handleRemove }
        replaceFile={ replaceFile }
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
      trigger={ <Button className="btn--edit" onClick={ openModal } size="small" basic>Edit</Button> }
    >
      <Header content={ title } />

      { saving
      && (
      <Notification
        el="p"
        show
        icon
        customStyles={ notificationStyles }
        msg="Saving changes..."
      />
      )
    }
      <Dimmer.Dimmable dimmed={ saving }>
        <Dimmer inverted simple />

        <Modal.Content>
          <Form> { renderGrid() } </Form>
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
  save: PropTypes.func
};

export default EditProjectFilesModal;
