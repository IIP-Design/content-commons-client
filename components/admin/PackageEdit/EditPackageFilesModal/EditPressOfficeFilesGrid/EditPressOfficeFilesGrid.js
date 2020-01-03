import React from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import EditPressOfficeFileRow from '../EditPressOfficeFileRow/EditPressOfficeFileRow';

const EditPressOfficeFilesGrid = ( {
  files, update, removeFile, accept
} ) => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={ 6 }>Files Selected</Grid.Column>
      <Grid.Column width={ 4 }>
        Release Type<span className="required"> *</span>
      </Grid.Column>
      <Grid.Column width={ 5 }>
        Lead Bureau(s)<span className="required"> *</span>
      </Grid.Column>
      <Grid.Column width={ 1 }></Grid.Column>
    </Grid.Row>

    { files.map( file => (
      <EditPressOfficeFileRow
        key={ file.id }
        file={ file }
        update={ update }
        removeFile={ removeFile }
        accept={ accept }
      />
    ) ) }
  </Grid>
);


EditPressOfficeFilesGrid.propTypes = {
  files: PropTypes.array,
  update: PropTypes.func,
  removeFile: PropTypes.func,
  accept: PropTypes.string
};

export default EditPressOfficeFilesGrid;
