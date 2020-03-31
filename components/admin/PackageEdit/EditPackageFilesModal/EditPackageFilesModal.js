import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import {
  Form, Button, Modal, Header, Dimmer
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { useFileStateManger } from 'lib/hooks/useFileStateManger';
import { normalize, isComplete } from 'lib/graphql/normalizers/package';
import Notification from 'components/Notification/Notification';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import FileUploadProgressBar from '../../FileUploadProgressBar/FileUploadProgressBar';

import './EditPackageFilesModal.scss';

const EditPressOfficeFilesGrid = dynamic( () => import(
  /* webpackChunkName: "editPressOfficeFilesGrid" */ './EditPressOfficeFilesGrid/EditPressOfficeFilesGrid'
) );

const EditPackageFilesModal = ( {
  title,
  filesToEdit,
  extensions,
  modalOpen,
  onClose,
  save,
  trigger,
  headerStyles
} ) => {
  const [open, setOpen] = useState( modalOpen );
  const [saving, setSaving] = useState( false );
  const [upload, setUpload] = useState( false );
  const [confirm, setConfirm] = useState( {} );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );

  const {
    state: { files, filesToRemove },
    reset,
    updateFileField,
    addFiles,
    removeFile
  } = useFileStateManger( normalize );

  useEffect( () => {
    setOpen( modalOpen );
    if ( modalOpen ) {
      addFiles( filesToEdit );
    } else {
      reset();
    }
  }, [modalOpen] );

  const allowedExtensions = extensions.join( ',' );

  const notificationStyles = {
    position: 'absolute',
    top: '15px',
    right: '40px'
  };

  const uploadProgessStyles = {
    margin: '-10px 15px 15px 15px'
  };

  useEffect( () => {
    setAllFieldsSelected( isComplete( files ) );
  }, [files] );

  const compareFilenames = ( a, b ) => {
    try {
      return a.name.localeCompare( b.name );
    } catch ( err ) {
      console.log( err );
    }
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
    if ( onClose && typeof onClose === 'function' ) {
      onClose();
    }
  };

  const updateField = ( e, data ) => {
    updateFileField( data );
  };

  const showFileErrors = uploadedFileErrors => {
    const errors = uploadedFileErrors.reduce( ( acc, cur ) => `${acc} ${cur.name}\n`, '' );
    const multiple = uploadedFileErrors.length > 1;
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
      addFiles( filesToAdd );
    }
  };

  const handleSave = async () => {
    setSaving( true );

    const uploadedFiles = files.filter( file => file.input );

    // if there are files to upload, show progress bar
    setUpload( uploadedFiles.length );

    // passed in save function
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

    return (
      <EditPressOfficeFilesGrid
        files={ files }
        update={ updateField }
        removeFile={ handleRemove }
        accept={ allowedExtensions }
      />
    );
  };

  return (
    <Modal
      open={ open }
      style={ { width: '900px' } }
      onClose={ closeModal }
      className="edit-support-files"
      size="small"
      closeOnDimmerClick={ !saving }
      trigger={ trigger }
    >
      <Header content={ title } style={ headerStyles } />

      { saving && (
        <Fragment>
          <Notification
            el="p"
            show
            icon
            customStyles={ notificationStyles }
            msg="Saving changes..."
          />

          { !!upload && (
            <FileUploadProgressBar
              filesToUpload={ files.filter( file => file.input ) }
              fileProgressMessage
              barSize="small"
              customStyles={ uploadProgessStyles }
            />
          ) }
        </Fragment>
      ) }

      <Dimmer.Dimmable dimmed={ saving }>
        <Dimmer inverted simple />

        <Modal.Content>
          <Form> { renderGrid() } </Form>
        </Modal.Content>
        <Modal.Actions>
          <Button className="secondary alternative" content="Cancel" onClick={ closeModal } />

          <ButtonAddFiles
            onChange={ handleAddFiles }
            multiple
            accept={ allowedExtensions }
            className="secondary"
          >
            Add Files
          </ButtonAddFiles>

          <Button
            className="primary"
            loading={ !!saving }
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

EditPackageFilesModal.propTypes = {
  title: PropTypes.string,
  type: PropTypes.string,
  filesToEdit: PropTypes.array,
  extensions: PropTypes.array,
  save: PropTypes.func,
  onClose: PropTypes.func,
  modalOpen: PropTypes.bool,
  trigger: PropTypes.node,
  headerStyles: PropTypes.object
};


export default EditPackageFilesModal;
