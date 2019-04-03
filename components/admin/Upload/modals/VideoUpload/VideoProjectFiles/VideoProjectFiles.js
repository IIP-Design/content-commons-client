import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import {
  Grid,
  Form,
  Button,
  Icon,
  Modal
} from 'semantic-ui-react';
import { isWindowWidthLessThanOrEqualTo } from 'lib/browser';
import VideoAssetFile from './VideoAssetFile';
import './VideoProjectFiles.scss';

class VideoProjectFiles extends PureComponent {
  state = {
    isMobileDevice: false,
    activeStep: 'step_1',
    cancelModalOpen: false,
    optionsIncomplete: 0,
    step2Complete: false,
    step2IncompleteCount: ''
  }

  componentDidMount() {
    this.props.updateModalClassname( 'upload_modal prepare-files-active' );
    const isMobileDevice = isWindowWidthLessThanOrEqualTo( 640 );
    const options = Array.from( document.querySelectorAll( '.videoProjectFiles_asset_options' ) ).filter(
      option => !option.className.includes( 'notApplicable' )
    );
    this.setState( { isMobileDevice, optionsIncomplete: options.length } );
  }

  componentDidUpdate( prevProps, prevState ) {
    const {
      isMobileDevice,
      activeStep,
      optionsIncomplete,
      step2Complete,
      step2IncompleteCount
    } = this.state;

    const options = Array.from( document.querySelectorAll( '.videoProjectFiles_asset_options' ) ).filter(
      option => !option.className.includes( 'notApplicable' )
    );

    // Both Steps & all dropdown options display on mobile, reset optionsIncomplete count
    if ( isMobileDevice && prevState.optionsIncomplete === 0 ) {
      /* eslint-disable-next-line react/no-did-update-set-state */
      this.setState( { optionsIncomplete: options.length } );
    }

    if ( !isMobileDevice ) {
      // Completed Step 1, proceeding to Step 2
      // Reset optionsIncomplete count unless previously selected options on Step 2 but not complete
      // reset to previous Step 2 optionsIncomplete count
      if (
        activeStep === 'step_2'
        && prevState.optionsIncomplete === 0
        && !step2Complete
      ) {
        /* eslint-disable-next-line react/no-did-update-set-state */
        return this.setState( {
          optionsIncomplete: step2IncompleteCount === '' ? options.length : step2IncompleteCount
        } );
      }

      // Completed Step 2
      if ( activeStep === 'step_2' && optionsIncomplete === 0 ) {
        /* eslint-disable-next-line react/no-did-update-set-state */
        return this.setState( { step2Complete: true, step2IncompleteCount: 0 } );
      }

      // Going back to Step 1, reset optionsIncomplete to 0
      // Store the optionsIncompleted from Step 2 if Step 2 not completed
      if ( prevState.activeStep === 'step_2' && activeStep === 'step_1' ) {
        /* eslint-disable-next-line react/no-did-update-set-state */
        return this.setState( {
          optionsIncomplete: 0,
          step2IncompleteCount: optionsIncomplete !== 0 ? prevState.optionsIncomplete : ''
        } );
      }
    }
  }

  componentWillUnmount() {
    this.props.updateModalClassname( 'upload_modal' );
  }

  setOptionsComplete = () => this.setState( prevState => ( {
    optionsIncomplete: prevState.optionsIncomplete !== 0
      ? prevState.optionsIncomplete - 1
      : prevState.optionsIncomplete
  } ) );

  toggleSteps = () => this.setState( prevState => ( {
    activeStep: prevState.activeStep === 'step_1' ? 'step_2' : 'step_1'
  } ) );

  openCancelModal = () => this.setState( { cancelModalOpen: true } );

  closeCancelModal = () => this.setState( { cancelModalOpen: false } );

  render() {
    const {
      closeModal,
      removeVideoAssetFile,
      replaceVideoAssetFile,
      files
    } = this.props;

    const {
      activeStep,
      cancelModalOpen,
      optionsIncomplete
    } = this.state;

    return (
      <Fragment>
        <h5 className="videoProjectFiles_headline">Preparing { files.length } files for upload...</h5>
        <div className="videoProjectFiles_steps">
          <p
            className={ `videoProjectFiles_step videoProjectFiles_step--one ${activeStep === 'step_1' ? 'active' : ''}` }
          >
            Step 1
          </p>
          <Icon name="chevron right" size="tiny" />
          <p
            className={ `videoProjectFiles_step videoProjectFiles_step--two ${activeStep === 'step_2' ? 'active' : ''}` }
          >
            Step 2
          </p>
        </div>

        <Form className="videoProjectFiles">
          <Grid>
            <Grid.Row className="videoProjectFiles_column_labels">
              <Grid.Column width={ 6 }>
                <p className="videoProjectFiles_column_label">Files Selected</p>
              </Grid.Column>
              <Grid.Column width={ 10 }>
                { activeStep === 'step_1' && (
                  <Fragment>
                    <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Language</p>
                    <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Subtitles</p>
                  </Fragment>
                ) }
                { activeStep === 'step_2' && (
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
                setOptionsComplete={ this.setOptionsComplete }
              />
            ) ) }

            { activeStep === 'step_1' && (
              <Grid.Row>
                <label className="ui button upload_button upload_button--fileUpload addFile" htmlFor="upload_video_assets">
                  <input
                    id="upload_video_assets"
                    type="file"
                    name="upload_video_assets"
                    multiple
                    onChange={ e => this.props.handleVideoAssetsUpload( e, true ) }
                  />
                  + Add Files
                </label>
              </Grid.Row>
            ) }
          </Grid>
          <Form.Field className="upload_actions">
            <Modal
              className="cancelModal"
              open={ cancelModalOpen }
              trigger={ (
                <Button
                  content="Cancel"
                  className="upload_button upload_button--cancelText"
                  onClick={ this.openCancelModal }
                />
              ) }
            >
              <Modal.Content>
                <h3>Are you sure you want to cancel uploading these files?</h3>
                <p>By cancelling, your files will not be uploaded to Content Commons.</p>
              </Modal.Content>
              <Modal.Actions>
                <Button
                  className="upload_button upload_button--cancelBtn"
                  content="No, take me back!"
                  onClick={ this.closeCancelModal }
                />
                <Button
                  className="upload_button upload_button--cancelGoBack"
                  content="Yes, cancel upload"
                  onClick={ closeModal }
                />
              </Modal.Actions>
            </Modal>
            <Button
              className={ `upload_button upload_button--previous ${activeStep === 'step_2' ? 'display' : ''}` }
              content="Previous"
              onClick={ this.toggleSteps }
            />
            <Button
              disabled={ optionsIncomplete !== 0 }
              className="upload_button upload_button--next"
              content={ activeStep === 'step_2' ? <Link href="/admin/upload"><a>Next</a></Link> : 'Next' }
              onClick={ this.toggleSteps }
            />
            <Button
              disabled={ optionsIncomplete !== 0 }
              className="upload_button upload_button--mobileUpload"
              content={ <Link href="/admin/upload"><a>Upload</a></Link> }
            />
          </Form.Field>
        </Form>
      </Fragment>
    );
  }
}

VideoProjectFiles.propTypes = {
  files: PropTypes.array,
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  handleVideoAssetsUpload: PropTypes.func,
  removeVideoAssetFile: PropTypes.func,
  replaceVideoAssetFile: PropTypes.func
};

export default VideoProjectFiles;
