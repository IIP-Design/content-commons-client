import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Checkbox,
  Button
} from 'semantic-ui-react';
import './VideoProjectType.scss';

class VideoProjectType extends Component {
  state = {};

  handleSelection = ( e, { value } ) => this.setState( { value } );

  render() {
    const { closeModal } = this.props;
    const { value } = this.state;

    return (
      <Form className="videoProjectType">
        <Form.Field>
          <Checkbox
            radio
            label="One video with its variations and assets"
            checked={ value === 'one_video' }
            value="one_video"
            onChange={ this.handleSelection }
          />
          <p>Select for importing video files and assets that are translated variations for one video.</p>
        </Form.Field>
        <Form.Field disabled>
          <Checkbox
            radio
            label="A set of videos that are related and their assets"
            checked={ value === 'multiple_video' }
            value="multiple_video"
            onChange={ this.handleSelection }
          />
          <p>Select for bulk importing multiple videos that are related to each other, but not variations of the same video.</p>
        </Form.Field>
        <Form.Field disabled>
          <Checkbox
            radio
            label="Unrelated video files and their assets"
            checked={ value === 'unrelated_video' }
            value="unrelated_video"
            onChange={ this.handleSelection }
          />
          <p>Select for bulk importing multiple videos that are unrelated to each other.</p>
        </Form.Field>
        <Form.Field className="upload_actions">
          <Button className="upload_button upload_button--back" content="Cancel" onClick={ closeModal } />
          { /* Open file upload on click */ }
          <Button className="upload_button upload_button--next" content="Next" onClick={ closeModal } />
        </Form.Field>
      </Form>
    );
  }
}

VideoProjectType.propTypes = {
  closeModal: PropTypes.func
};

export default VideoProjectType;
