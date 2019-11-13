import React from 'react';
import PropTypes from 'prop-types';
import { Form, Grid, Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './PackageFiles.scss';

const PackageFiles = props => {
  const { files, accept, closeModal } = props;
  const headline = `Preparing ${files.length} files for upload...`;

  return (
    <Form className="packageFiles">
      <h5 className="packageFiles_headline">{ headline }</h5>
      <Grid>
        <Grid.Row className="packageFiles_tableHeaders">
          <Grid.Column width={ 6 }>Files Selected</Grid.Column>
          <Grid.Column width={ 6 }>Title</Grid.Column>
          <Grid.Column width={ 4 }>Release Type</Grid.Column>
        </Grid.Row>

        { files.map( file => (
          <Grid.Row key={ file.name }>
            <Grid.Column><p>{ file.name }</p></Grid.Column>
          </Grid.Row>
        ) ) }
        <Grid.Row style={ { paddingLeft: '1rem' } }>
          <ButtonAddFiles
            className="secondary"
            accept={ accept }
            multiple
          >
            Add files
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
};

export default PackageFiles;
