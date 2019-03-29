import React, { useEffect, useState, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid,
  Form,
  Button,
  Step
} from 'semantic-ui-react';
import { withRouter } from 'next/router';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../CancelUpload/CancelUpload';
import VideoProjectFilesRow from './VideoProjectFilesRow';
import './VideoProjectFiles.scss';

const VideoProjectFiles = props => {
  const [activeStep, setActiveStep] = useState( 1 );

  const styles = {
    hide: {
      display: 'none'
    },
    show: {
      display: 'inline-block'
    }
  };

  const show = flag => ( activeStep === flag ? styles.show : styles.hide );

  const gotoVideoEditPage = () => {
    // /admin/project?content=video&id=234&action=edit
    props.router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        action: 'edit'
      }
    } );
  };

  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal prepare-files-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );

  const {
    closeModal,
    files,
    allFieldsSelected
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
            <Grid.Column width={ 6 }>Files Selected</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 1 ) }>Language</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 1 ) }>Subtitles</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 2 ) }>Type / Use</Grid.Column>
            <Grid.Column width={ 4 } style={ show( 2 ) }>Quality</Grid.Column>
            <Grid.Column width={ 2 }></Grid.Column>
          </Grid.Row>

          { files.map( file => (
            <VideoProjectFilesRow
              key={ file.id }
              file={ file }
              updateField={ props.updateField }
              replaceAssetFile={ props.replaceAssetFile }
              removeAssetFile={ props.removeAssetFile }
              showColumn={ show }
              activeStep={ activeStep }
            />
          ) ) }

          { activeStep === 1 && (
          <Grid.Row>
            <ButtonAddFiles onChange={ e => props.addAssetFiles( e.target.files ) } multiple className="secondary">+ Add Files</ButtonAddFiles>
          </Grid.Row>
          ) }
        </Grid>
        <Form.Field className="upload_actions">
          <CancelUpload closeModal={ closeModal } />
          <Button
            className="secondary"
            style={ activeStep === 2 ? { display: 'inline-block' } : { display: 'none' } }
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
            content="Next"
            disabled={ !allFieldsSelected }
            style={ show( 2 ) }
            onClick={ gotoVideoEditPage }
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
  addAssetFiles: PropTypes.func,
  removeAssetFile: PropTypes.func,
  replaceAssetFile: PropTypes.func,
  updateField: PropTypes.func,
  router: PropTypes.object,
  allFieldsSelected: PropTypes.bool
};

export default withRouter( VideoProjectFiles );
