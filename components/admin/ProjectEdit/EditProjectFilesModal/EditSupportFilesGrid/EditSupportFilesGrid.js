import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import EditSupportFileRow from '../EditSupportFileRow/EditSupportFileRow';

const EditSupportFilesGrid = ( {
  files, update, removeFile, accept,
} ) => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={ 8 }>Files Selected</Grid.Column>
      <Grid.Column width={ 6 }>
        { 'Language ' }
        <span className="required"> *</span>
      </Grid.Column>
      <Grid.Column width={ 2 } />
    </Grid.Row>

    { files.map( file => (
      <EditSupportFileRow
        key={ file.id }
        file={ file }
        update={ update }
        removeFile={ removeFile }
        accept={ accept }
      />
    ) ) }
  </Grid>
);


EditSupportFilesGrid.propTypes = {
  files: PropTypes.array,
  update: PropTypes.func,
  removeFile: PropTypes.func,
  accept: PropTypes.string,
};

export default EditSupportFilesGrid;
