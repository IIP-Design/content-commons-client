import React, { Component, Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Grid, Form, Button, Select, Icon
} from 'semantic-ui-react';
import './VideoProjectFiles.scss';

const options = [
  { key: 'test1', value: 'test1', text: 'Test 1' },
  { key: 'test2', value: 'test2', text: 'Test 2' },
  { key: 'test3', value: 'test3', text: 'Test 3' }
];

class VideoProjectFiles extends Component {
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
              <Grid.Column width={ 5 }>
                <p className="videoProjectFiles_column_label">Language</p>
              </Grid.Column>
              <Grid.Column width={ 5 }>
                <p className="videoProjectFiles_column_label">Subtitles</p>
              </Grid.Column>
            </Grid.Row>

            { filesArray.map( file => (
              <Grid.Row key={ file.name } className="videoProjectFiles_asset">
                <Grid.Column width={ 6 }>
                  <p className="videoProjectFiles_asset_file">{ file.name }</p>
                </Grid.Column>
                <Grid.Column width={ 5 }>
                  <Select options={ options } className="videoProjectFiles_asset_language" />
                </Grid.Column>
                <Grid.Column width={ 5 }>
                  <Select options={ options } className="videoProjectFiles_asset_subtitles" />
                </Grid.Column>
              </Grid.Row>
            ) ) }
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
  goNext: PropTypes.func
};

export default VideoProjectFiles;
