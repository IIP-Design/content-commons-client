import React, { useState } from 'react';
import {
  Grid,
  Form,
  Button,
  Step,
} from 'semantic-ui-react';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../../CancelUpload/CancelUpload';
import IncludeRequiredFileMsg from '../../../IncludeRequiredFileMsg/IncludeRequiredFileMsg';
import VideoProjectFilesRowDesktop from './VideoProjectFilesRowDesktop';
import { VideoUploadContext } from '../../VideoUploadContext';

import './VideoProjectFilesDesktop.scss';

const VideoProjectFilesDesktop = () => {
  const [activeStep, setActiveStep] = useState( 1 );
  const [includeRequiredFileMsg, setIncludeRequiredFileMsg] = useState( false );

  /**
   * Toggles columns shown based on active step
   * @param {number} step activeStep
   */
  const show = step => ( activeStep === step
    ? { display: 'inline-block' }
    : { display: 'none' } );

  const stepOneComplete = files => files.every( file => {
    const { input: { type } } = file;

    if ( type.includes( 'video' ) ) {
      if ( activeStep === 1 ) {
        return file.language && file.videoBurnedInStatus;
      }

      return file.quality;
    }

    return file.language;
  } );

  const stepIncludesVideoFiles = files => files.some( file => {
    const { type } = file.input;

    return type === 'video/mp4' || type === 'video/quicktime';
  } );

  return (
    // Context API is used to avoind having to pass props down multiple levels
    <VideoUploadContext.Consumer>
      { ( {
        files,
        addAssetFiles,
        closeModal,
        allFieldsSelected,
        handleAddFilesToUpload,
        compareFilenames,
      } ) => (
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
                <Grid.Column width={ 4 } style={ show( 1 ) }>Language<span className="required">*</span></Grid.Column>
                <Grid.Column width={ 4 } style={ show( 1 ) }>Subtitles<span className="required">*</span></Grid.Column>
                <Grid.Column width={ 4 } style={ show( 2 ) }>Type / Use<span className="required">*</span></Grid.Column>
                <Grid.Column width={ 4 } style={ show( 2 ) }>Quality<span className="required">*</span></Grid.Column>
                <Grid.Column width={ 2 }></Grid.Column>
              </Grid.Row>

              { files.sort( compareFilenames ).map( file => (
                <VideoProjectFilesRowDesktop
                  key={ file.id }
                  file={ file }
                  activeStep={ activeStep }
                  show={ show }
                />
              ) ) }

              <Grid.Row style={ { paddingLeft: '1rem' } }>
                <ButtonAddFiles
                  onChange={ e => addAssetFiles( e.target.files ) }
                  multiple
                  className="secondary"
                  accept=".srt, .mov, .mp4, .jpg, .png, .jpeg"
                >
                  Add Files
                </ButtonAddFiles>
              </Grid.Row>

            </Grid>
            <Form.Field className="upload_actions">
              <CancelUpload closeModal={ closeModal } />
              <Button
                className="secondary"
                style={ show( 2 ) }
                content="Previous"
                onClick={ () => { setActiveStep( 1 ); } }
              />
              <Button
                className="primary"
                content="Next"
                disabled={ !stepOneComplete( files ) || files.length === 0 }
                style={ show( 1 ) }
                onClick={ () => { setActiveStep( 2 ); } }
              />
              <Button
                className="primary"
                type="button"
                content="Continue"
                disabled={ !allFieldsSelected || files.length === 0 }
                style={ show( 2 ) }
                onClick={ () => {
                  if ( !stepIncludesVideoFiles( files ) ) {
                    return setIncludeRequiredFileMsg( true );
                  }
                  handleAddFilesToUpload();
                } }
              />
            </Form.Field>
          </Form>
          <IncludeRequiredFileMsg
            includeRequiredFileMsg={ includeRequiredFileMsg }
            setIncludeRequiredFileMsg={ setIncludeRequiredFileMsg }
          />
        </div>
      ) }
    </VideoUploadContext.Consumer>
  );
};


export default VideoProjectFilesDesktop;
