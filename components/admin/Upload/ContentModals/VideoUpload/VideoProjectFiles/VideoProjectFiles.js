import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Form, Button, Icon
} from 'semantic-ui-react';
import './VideoProjectFiles.scss';
import FilesStepOne from './FilesStepOne';
import FilesStepTwo from './FilesStepTwo';

class VideoProjectFiles extends PureComponent {
  state = {
    activeStep: 'step_1',
  }

  componentDidMount() {
    this.props.updateModalClassname( 'upload_modal prepare-files-active' );
  }

  componentWillUnmount() {
    this.props.updateModalClassname( 'upload_modal' );
  }

  toggleSteps = () => this.setState( prevState => ( {
    activeStep: prevState.activeStep === 'step_1' ? 'step_2' : 'step_1'
  } ) );

  render() {
    const filesArray = Array.from( this.props.files );
    const { closeModal } = this.props;
    const { activeStep } = this.state;

    return (
      <Fragment>
        <h5 className="videoProjectFiles_headline">Preparing { filesArray.length } files for upload...</h5>

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

            { activeStep === 'step_1' && filesArray.map( file => (
              <FilesStepOne key={ file.name } file={ file } />
            ) ) }
            { activeStep === 'step_2' && filesArray.map( file => (
              <FilesStepTwo key={ file.name } file={ file } />
            ) ) }

            { activeStep === 'step_1' && (
              <Grid.Row>
                <Button className="upload_button upload_button--addFile">+ Add Files</Button>
              </Grid.Row>
            ) }
          </Grid>

          <Form.Field className="upload_actions">
            <Button className="upload_button upload_button--cancelText" content="Cancel" onClick={ closeModal } />
            <Button
              className={ `upload_button upload_button--previous ${activeStep === 'step_2' ? 'display' : ''}` }
              content="Previous"
              onClick={ this.toggleSteps }
            />
            <Button
              disabled={ activeStep === 'step_2' }
              className="upload_button upload_button--next"
              content="Next"
              onClick={ this.toggleSteps }
            />
          </Form.Field>
        </Form>
      </Fragment>
    );
  }
}

VideoProjectFiles.propTypes = {
  files: PropTypes.object,
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default VideoProjectFiles;
