import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Form, Button, Modal, Dimmer, Step
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { useFileUploadActions } from 'lib/hooks/useFileUploadActions';
import { compareFilenames } from 'lib/utils';
import Notification from 'components/Notification/Notification';
import DynamicConfirm from 'components/admin/DynamicConfirm/DynamicConfirm';
import EditProjectUnitsRow from '../EditProjectUnitsRow/EditProjectUnitsRow';

import './EditProjectUnits.scss';

const EditProjectUnits = props => {
  const { videoUnits } = props;
  const [open, setOpen] = useState( false );
  const [confirm, setConfirm] = useState( {} );
  const [activeStep, setActiveStep] = useState( 1 );
  const [allFieldsSelected, setAllFieldsSelected] = useState( false );
  const [saving, setSaving] = useState( false );

  const {
    state: { files, filesToRemove },
    reset,
    updateFileField,
    addFiles,
    removeFile,
    replaceFile
  } = useFileUploadActions();

  useEffect( () => {
    const complete = files.every( file => file.language && file.videoBurnedInStatus && file.use && file.quality );

    setAllFieldsSelected( complete );
  }, [files] );

  const notificationStyles = {
    position: 'absolute',
    top: '15px',
    right: '40px'
  };

  /**
   * Toggles columns shown based on active step
   * @param {number} step activeStep
   */
  const show = step => ( activeStep === step
    ? { display: 'inline-block' }
    : { display: 'none' } );

  const closeModal = () => {
    setOpen( false );
    reset();
  };

  const openModal = () => {
    const vidUnits = videoUnits.map( unit => unit.files );
    addFiles( ...vidUnits );
    setOpen( true );
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

  const handleAddFiles = e => {
    const filesToAdd = Array.from( e.target.files );
    if ( files.length ) {
      const currentFiles = files.map( file => file.name );
      checkForDuplicates( currentFiles, filesToAdd );
    } else {
      addFiles( filesToAdd );
    }
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

  const updateField = ( e, data ) => {
    updateFileField( data );
  };

  const stepOneComplete = vidFiles => vidFiles.every( file => {
    if ( activeStep === 1 ) {
      return ( file.language && file.videoBurnedInStatus );
    }
    return ( file.quality );
  } );

  return (
    <Modal
      className="edit-project-units"
      size="small"
      open={ open }
      onClose={ closeModal }
      trigger={ (
        <Button
          className="edit-project__add-more"
          content="+ Edit video files for this project"
          basic
          onClick={ openModal }
        />
      ) }
    >
      <Modal.Header>Edit video files in this project</Modal.Header>
      { saving && (
        <Notification
          el="p"
          show
          icon
          customStyles={ notificationStyles }
          msg="Saving changes..."
        />
      ) }
      <Dimmer.Dimmable dimmed={ saving }>
        <Dimmer inverted simple />
        <Modal.Content>
          <div className="videoProjectFilesDesktop__wrapper">
            <Form>
              <div className="videoProjectFilesDesktop__steps">
                <Step.Group>
                  <Step active={ activeStep === 1 } title="Step 1" />
                  <Step active={ activeStep === 2 } title="Step 2" />
                </Step.Group>
              </div>
              <Grid>
                <Grid.Row className="videoProjectFilesDesktop__row-header">
                  <Grid.Column width={ 6 }>Files Selected</Grid.Column>
                  <Grid.Column width={ 4 } style={ show( 1 ) }>Language<span className="required"> *</span></Grid.Column>
                  <Grid.Column width={ 4 } style={ show( 1 ) }>Subtitles<span className="required"> *</span></Grid.Column>
                  <Grid.Column width={ 4 } style={ show( 2 ) }>Type / Use<span className="required">*</span></Grid.Column>
                  <Grid.Column width={ 4 } style={ show( 2 ) }>Quality<span className="required">*</span></Grid.Column>
                  <Grid.Column width={ 2 }></Grid.Column>
                </Grid.Row>

                { files.sort( compareFilenames ).map( file => (
                  <EditProjectUnitsRow
                    key={ file.id }
                    videoFile={ file }
                    update={ updateField }
                    removeFile={ handleRemove }
                    replaceFile={ replaceFile }
                    activeStep={ activeStep }
                    show={ show }
                  />
                ) ) }

                <Grid.Row style={ { paddingLeft: '1rem' } }>
                  <ButtonAddFiles
                    onChange={ handleAddFiles }
                    multiple
                    className="secondary"
                    accept=".mov, .mp4, .mpg, .wmv, .avi"
                  > Add Files
                  </ButtonAddFiles>
                </Grid.Row>
              </Grid>
            </Form>
          </div>
        </Modal.Content>
      </Dimmer.Dimmable>
      <Modal.Actions className="">
        <Button
          className="secondary alternative"
          content="Cancel"
          onClick={ closeModal }
        />
        <Button
          className="secondary"
          style={ show( 2 ) }
          content="Previous"
          onClick={ () => { setActiveStep( 1 ); } }
        />
        <Button
          className="primary"
          style={ show( 1 ) }
          content="Next"
          disabled={ !stepOneComplete( files ) || files.length === 0 }
          onClick={ () => { setActiveStep( 2 ); } }
        />
        <Button
          type="button"
          className="primary"
          style={ show( 2 ) }
          content="Save"
          disabled={ !allFieldsSelected }
          // onClick={ handleSave }
        />
      </Modal.Actions>

      <DynamicConfirm { ...confirm } />

    </Modal>
  );
};

EditProjectUnits.propTypes = {
  videoUnits: PropTypes.array
};

export default EditProjectUnits;
