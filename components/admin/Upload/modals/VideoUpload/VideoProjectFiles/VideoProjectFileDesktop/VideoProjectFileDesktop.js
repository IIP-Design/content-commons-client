import React, { useState, useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Form,
  Button,
  Step
} from 'semantic-ui-react';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../../CancelUpload/CancelUpload';
import VideoProjectFilesRowDesktop from './VideoProjectFilesRowDesktop';
import './VideoProjectFilesDesktop.scss';
import { UploadFilesContext } from '../../../../UploadFilesContext';

const VideoProjectFilesDesktop = props => {
  console.log( 'rendering VideoProjectFilesDesktop' );
  const { files, addFiles, complete } = useContext( UploadFilesContext );
  const [activeStep, setActiveStep] = useState( 1 );

  const { addFilesToUpload, closeModal } = props;

  const handleAddFilesToUpload = () => {
    addFilesToUpload( files );
  };

  /**
   * Toggles columns shown based on active step
   * @param {number} step activeStep
   */
  const show = step => ( activeStep === step
    ? { display: 'inline-block' }
    : { display: 'none' } );

  return (
    <div className="videoProjectFilesDesktop__wrapper">
      <div className="videoProjectFilesDesktop__steps">
        <Step.Group>
          <Step active={ activeStep === 1 } title="Step 1" />
          <Step active={ activeStep === 2 } title="Step 2" />
        </Step.Group>
      </div>
      <Form>
        <Grid>
          <Grid.Row className="videoProjectFilesDesktop__row-header">
            <Grid.Column width={ 6 }>Files Selected</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 1 ) }>Language</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 1 ) }>Subtitles</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 2 ) }>Type / Use</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 2 ) }>Quality</Grid.Column>
            <Grid.Column width={ 2 }></Grid.Column>
          </Grid.Row>

          { files.map( file => (
            <VideoProjectFilesRowDesktop
              key={ file.id }
              file={ file }
              activeStep={ activeStep }
              show={ show }
            />
          ) ) }

          <Grid.Row style={ { paddingLeft: '1rem' } }>
            <ButtonAddFiles onChange={ e => addFiles( e.target.files ) } multiple className="secondary">+ Add Files</ButtonAddFiles>
          </Grid.Row>

        </Grid>
        <Form.Field className="upload_actions">
          <CancelUpload closeModal={ closeModal } />

          <Button
            className="secondary"
            style={ show( 2 ) }
            content="Previous"
            onClick={ () => setActiveStep( 1 ) }
          />
          <Button
            className="primary"
            content="Next"
            style={ show( 1 ) }
            onClick={ () => setActiveStep( 2 ) }
          />

          <Button
            className="primary"
            content="Continue"
            disabled={ !complete }
            style={ show( 2 ) }
            onClick={ handleAddFilesToUpload }
          />

        </Form.Field>
      </Form>
    </div>
  );
};

VideoProjectFilesDesktop.propTypes = {
  addFilesToUpload: PropTypes.func,
  closeModal: PropTypes.func
};

export default VideoProjectFilesDesktop;
