import React, { PureComponent, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Form, Button, Select, Icon
} from 'semantic-ui-react';
import replaceIcon from '../../../../../../static/icons/icon_replace.svg';
import removeIcon from '../../../../../../static/icons/icon_remove.svg';
import './VideoProjectFiles.scss';

const options = [
  { key: 'test1', value: 'test1', text: 'Test 1' },
  { key: 'test2', value: 'test2', text: 'Test 2' },
  { key: 'test3', value: 'test3', text: 'Test 3' }
];

class VideoProjectFiles extends PureComponent {
  componentDidMount() {
    this.props.updateModalClassname( 'upload_modal prepare-files-active' );
  }

  componentWillUnmount() {
    this.props.updateModalClassname( 'upload_modal' );
  }

  render() {
    const filesArray = Array.from( this.props.files );
    const { closeModal, goNext } = this.props;

    return (
      <Fragment>
        <h5 className="videoProjectFiles_headline">Preparing { filesArray.length } files for upload...</h5>

        <div className="videoProjectFiles_steps">
          <p className="videoProjectFiles_step videoProjectFiles_step--one">Step 1</p>
          <Icon name="chevron right" size="tiny" />
          <p className="videoProjectFiles_step videoProjectFiles_step--two active">Step 2</p>
        </div>

        <Form className="videoProjectFiles">
          <Grid>
            <Grid.Row className="videoProjectFiles_column_labels">
              <Grid.Column width={ 6 }>
                <p className="videoProjectFiles_column_label">Files Selected</p>
              </Grid.Column>
              <Grid.Column width={ 10 }>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Language</p>
                <p className="videoProjectFiles_column_label videoProjectFiles_column_label--required">Subtitles</p>
              </Grid.Column>
            </Grid.Row>

            { filesArray.map( file => (
              <Grid.Row key={ file.name } className="videoProjectFiles_asset">
                <Grid.Column width={ 6 }>
                  <p className="videoProjectFiles_asset_file">{ file.name }</p>
                </Grid.Column>
                <Grid.Column width={ 10 }>
                  <Select
                    options={ options }
                    className="videoProjectFiles_asset_language"
                    placeholder="-"
                  />
                  <Select
                    options={ options }
                    className="videoProjectFiles_asset_subtitles"
                    placeholder="-"
                  />
                  <div className="videoProjectFiles_asset_actionBtns">
                    <img
                      src={ replaceIcon }
                      alt="Replace Video File Button"
                      className="videoProjectFiles_asset_replaceBtn"
                    />
                    <img
                      src={ removeIcon }
                      alt="Remove Video File Button"
                      className="videoProjectFiles_asset_removeBtn"
                    />
                  </div>
                </Grid.Column>
              </Grid.Row>
            ) ) }

            <Grid.Row>
              <Button className="upload_button upload_button--addFile">Add Files</Button>
            </Grid.Row>
          </Grid>

          <Form.Field className="upload_actions">
            <Button className="upload_button upload_button--back" content="Cancel" onClick={ closeModal } />
            <Button className="upload_button upload_button--next" content="Next" onClick={ goNext } />
          </Form.Field>

        </Form>
      </Fragment>
    );
  }
}

VideoProjectFiles.propTypes = {
  files: PropTypes.object,
  closeModal: PropTypes.func,
  goNext: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default VideoProjectFiles;
