import React from 'react';
import {
  Form, Grid, Button, Icon
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import PackageFilesRow from './PackageFilesRow';
import { PackageUploadContext } from '../PackageUpload';
import './PackageFiles.scss';

const PackageFiles = () => (
  <PackageUploadContext.Consumer>
    {
      ( {
        files,
        accept,
        closeModal,
        addPackageFiles,
        allFieldsSelected,
        handlefileUploads,
      } ) => (
        <Form className="packageFiles">
          <h5 className="packageFiles_headline">{ `Preparing ${files.length} files for upload...` }</h5>
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
              disabled={ !allFieldsSelected }
              type="button"
              className="primary"
              content="Save & Continue"
              onClick={ () => handlefileUploads() }
            />
          </Form.Field>
        </Form>
      )
    }

  </PackageUploadContext.Consumer>
);

export default PackageFiles;
