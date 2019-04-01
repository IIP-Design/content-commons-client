/**
 *
 * LinkForm
 *
 */

import React from 'react';
// import PropTypes from 'prop-types';
// import './LinkForm.css';

import {
  Form,
  Grid,
  Input
} from 'semantic-ui-react';

const LinkForm = () => (
  <Form className="edit-video__form video-link-data">
    <Grid stackable>
      <Grid.Row>
        <Grid.Column mobile={ 16 } computer={ 10 }>
          <Form.Field
            id="video-youtube"
            control={ Input }
            label="YouTube URL - paste YouTube url link here"
            autoFocus
            name="youtube"
            // value={ videoTitle }
            // onChange={ handleChange }
          />

          <Form.Field
            id="video-description"
            control={ Input }
            label="Vimeo URL - paste Vimeo url link here"
            autoFocus
            name="vimeo"
          />
        </Grid.Column>
      </Grid.Row>
    </Grid>
  </Form>
);

LinkForm.propTypes = {};

export default LinkForm;
