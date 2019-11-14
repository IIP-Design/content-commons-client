import React from 'react';
import PropTypes from 'prop-types';
import {
  Form, Grid, Button, Icon
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import PackageFilesRow from './PackageFilesRow';
import './PackageFiles.scss';

const PackageFiles = props => {
  const {
    files,
    accept,
    closeModal,
    updateField,
    addPackageFiles,
    removePackageFile,
  } = props;

  const headline = `Preparing ${files.length} files for upload...`;

  return (
    <Form className="packageFiles">
      <h5 className="packageFiles_headline">{ headline }</h5>
      <Grid className="packageFiles_grid">
        <Grid.Row className="packageFiles_tableHeaders">
          <Grid.Column width={ 6 }>Files Selected</Grid.Column>
          <Grid.Column width={ 6 }>Title<span className="required">*</span></Grid.Column>
          <Grid.Column width={ 4 }>Release Type<span className="required">*</span></Grid.Column>
        </Grid.Row>

        { files.map( file => (
          <PackageFilesRow
            key={ file.id }
            file={ file }
            updateField={ updateField }
            removePackageFile={ removePackageFile }
          />
        ) ) }

        <Grid.Row>
          <ButtonAddFiles
            className="secondary"
            accept={ accept }
            multiple
            onChange={ e => addPackageFiles( e.target.files ) }
          >
            <span className="buttonAddFiles_iconText"><Icon name="plus" size="tiny" /> Add files</span>
          </ButtonAddFiles>
        </Grid.Row>
      </Grid>
      <Form.Field>
        <Button
          type="button"
          className="secondary alternative"
          content="Cancel"
          onClick={ closeModal }
        />
        <Button
          type="button"
          className="primary"
          content="Save & Continue"
          onClick={ () => console.log( 'SAVE & CONTINUE' ) }
        />
      </Form.Field>
    </Form>
  );
};

PackageFiles.propTypes = {
  accept: PropTypes.string,
  closeModal: PropTypes.func,
  files: PropTypes.array,
  updateField: PropTypes.func,
  addPackageFiles: PropTypes.func,
  removePackageFile: PropTypes.func,
};

export default PackageFiles;
