import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Grid } from 'semantic-ui-react';
import EditVideoFileRow from '../EditVideoFileRow/EditVideoFileRow';

const EditVideoFilesGrid = ( {
  files, update, removeFile, replaceFile, accept, step
} ) => (
  <Grid>
    <Grid.Row>
      <Grid.Column width={ 6 }>Files Selected</Grid.Column>
      { step === 1 && (
        <Fragment>
          <Grid.Column width={ 4 }>Language<span className="required"> *</span></Grid.Column>
          <Grid.Column width={ 4 }>Subtitles<span className="required"> *</span></Grid.Column>
        </Fragment>
      )
      }

      { step === 2 && (
        <Fragment>
          <Grid.Column width={ 4 }>Type/Use<span className="required"> *</span></Grid.Column>
          <Grid.Column width={ 4 }>Quality<span className="required"> *</span></Grid.Column>
        </Fragment>
      )
      }

      <Grid.Column width={ 2 }></Grid.Column>
    </Grid.Row>

    { files.map( file => (
      <EditVideoFileRow
        key={ file.id }
        file={ file }
        update={ update }
        removeFile={ removeFile }
        replaceFile={ replaceFile }
        accept={ accept }
        step={ step }
      />
    ) ) }
  </Grid>
);


EditVideoFilesGrid.propTypes = {
  files: PropTypes.array,
  update: PropTypes.func,
  removeFile: PropTypes.func,
  replaceFile: PropTypes.func,
  accept: PropTypes.string,
  step: PropTypes.number
};

export default EditVideoFilesGrid;
