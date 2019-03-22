import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Grid,
  Form,
  Button,
  Step
} from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../CancelUpload/CancelUpload';
import VideoAssetFile from './VideoAssetFile';
import './VideoProjectFiles.scss';

const VideoProjectFiles = props => {
  const [activeStep, setActiveStep] = useState( 1 );

  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal prepare-files-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );

  const {
    closeModal,
    removeVideoAssetFile,
    replaceVideoAssetFile,
    files
  } = props;

  return (
    <Fragment>
      <h5 className="videoProjectFiles_headline">Preparing { files.length } files for upload...</h5>
      <div className="videoProjectFiles_steps">
        <Step.Group>
          <Step active={ activeStep === 1 } title="Step 1" />
          <Step active={ activeStep === 2 } title="Step 2" />
        </Step.Group>
      </div>
      <Form className="videoProjectFiles">
        <Grid>
          <Grid.Row className="videoProjectFiles_column_labels">
            <Grid.Column width={ 6 }>
              <p className="videoProjectFiles_column_label">Files Selected</p>
            </Grid.Column>
            <Grid.Column width={ 10 }>
              { activeStep === 1 && (
              <Fragment>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Language</p>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Subtitles</p>
              </Fragment>
              ) }
              { activeStep === 2 && (
              <Fragment>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Type / Use</p>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Quality</p>
              </Fragment>
              ) }
            </Grid.Column>
          </Grid.Row>

          { files.map( ( file, i ) => (
            <VideoAssetFile
              key={ `${file}_${i}` }
              activeStep={ activeStep }
              file={ file }
              removeVideoAssetFile={ removeVideoAssetFile }
              replaceVideoAssetFile={ replaceVideoAssetFile }
            />
          ) ) }

          { activeStep === 1 && (
          <Grid.Row>
            <ButtonAddFiles onChange={ e => props.handleVideoAssetsUpload( e ) } multiple className="secondary" />
          </Grid.Row>
          ) }
        </Grid>
        <Form.Field className="upload_actions">
          <CancelUpload closeModal={ closeModal } />
          <Button
            className={ `upload_button upload_button--previous ${activeStep === 2 ? 'display' : ''}` }
            content="Previous"
            onClick={ () => setActiveStep( 1 ) }
          />
          <Button
            className="upload_button upload_button--next"
            content={ activeStep === 2 ? <Link href="/admin/upload"><a>Next</a></Link> : 'Next' }
            onClick={ () => setActiveStep( 2 ) }
          />
          <Button
            className="upload_button upload_button--mobileUpload"
            content={ <Link href="/admin/upload"><a>Upload</a></Link> }
          />
        </Form.Field>
      </Form>
    </Fragment>
  );
};


VideoProjectFiles.propTypes = {
  files: PropTypes.array,
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  handleVideoAssetsUpload: PropTypes.func,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func
};

export default VideoProjectFiles;
