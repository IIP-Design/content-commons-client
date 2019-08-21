import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Form, Button, Modal, Header
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import { useFileActions } from 'lib/hooks/useFileActions';
import EditSupportFileRow from '../EditSupportFileRow/EditSupportFileRow';
import './EditSupportFiles.scss';

const EditSupportFiles = ( {
  supportFiles, extensions, updateDatabase, removeFromDataBase
} ) => {
  const [open, setOpen] = useState( false );

  const {
    state: { files, filesToRemove },
    reset,
    updateFileField,
    addFiles,
    removeFile,
    replaceFile
  } = useFileActions();

  const allowedExtensions = extensions.join( ',' );
  const compareFilenames = ( a, b ) => {
    try {
      return a.name.localeCompare( b.name );
    } catch ( err ) {
      console.log( err );
    }
  };

  const closeModal = () => {
    setOpen( false );
    reset();
  };

  const openModal = () => {
    addFiles( supportFiles );
    setOpen( true );
  };

  const updateField = ( e, data ) => {
    updateFileField( data );
  };

  const handleSave = () => {
    /*
      1. loop thru files
      2. if input prop present, upload
      3. get file meta data back
      4. update db
      -----
      1. loop thru files to remove
      2. delete file from s3
      3. delete from db
    */

    updateDatabase( files );
    removeFromDataBase( filesToRemove );
  };

  return (
    <Modal
      open={ open }
      onClose={ closeModal }
      className="edit-support-files"
      size="small"
      trigger={ <Button className="btn--edit" onClick={ openModal } size="small" basic>Edit</Button> }
    >
      <Header content="Edit thumbnail files in this project" />
      <Modal.Content>
        <Form>
          <Grid>
            <Grid.Row>
              <Grid.Column width={ 8 }>Files Selected</Grid.Column>
              <Grid.Column width={ 6 }>Language<span className="required"> *</span></Grid.Column>
              <Grid.Column width={ 2 }></Grid.Column>
            </Grid.Row>

            { files.sort( compareFilenames ).map( file => (
              <EditSupportFileRow
                key={ file.id }
                file={ file }
                update={ updateField }
                removeFile={ removeFile }
                replaceFile={ replaceFile }
                accept={ allowedExtensions }
              />
            ) ) }
          </Grid>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          className="secondary alternative"
          content="Cancel"
          onClick={ closeModal }
        />
        <ButtonAddFiles
          onChange={ e => addFiles( e.target.files ) }
          multiple
          accept={ allowedExtensions }
          className="secondary"
        >Add Files
        </ButtonAddFiles>

        <Button
          className="primary"
          type="button"
          content="Save"
          onClick={ handleSave }
        />
      </Modal.Actions>
    </Modal>
  );
};

EditSupportFiles.propTypes = {
  supportFiles: PropTypes.array,
  extensions: PropTypes.array,
  updateDatabase: PropTypes.func,
  removeFromDataBase: PropTypes.func
};

export default EditSupportFiles;
