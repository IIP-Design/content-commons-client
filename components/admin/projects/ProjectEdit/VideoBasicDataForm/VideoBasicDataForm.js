/**
 *
 * VideoBasicDataForm
 *
 */

import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { object } from 'prop-types';

import {
  Form,
  Grid,
  Input,
  Select,
  TextArea
} from 'semantic-ui-react';

import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';

class VideoBasicDataForm extends Component {
  render() {
    const videoQuality = (
      <label htmlFor="video-quality"> { /* eslint-disable-line */ }
        Video Quality
        <IconPopup
          iconType="info circle"
          id="video-quality"
          message="Web: small - for social sharing, Broadcast: large - ambassador videos"
          size="small"
        />
      </label>
    );

    const {
      data: { error, loading, videoUnit }
    } = this.props;

    if ( loading ) return 'Loading video data...';
    if ( error ) return `Error! ${error.message}`;

    return (
      <Form className="edit-video__form video-basic-data">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 10 }>
              <Form.Field
                id="video-title"
                control={ Input }
                label="Video Title in Language"
                autoFocus
                name="title"
                value={ videoUnit.title }
                // onChange={ handleChange }
              />

              <Form.Field
                id="video-description"
                control={ TextArea }
                label="Public Description in Language (e.g. - YouTube)"
                autoFocus
                name="description"
                value={ videoUnit.descPublic }
              />

              <Form.Field
                id="video-keywords"
                control={ Input }
                label="Additional Keywords in Language"
                autoFocus
                name="keywords"
              />
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 6 }>
              <Form.Field
                id="video-language"
                control={ Select }
                label="Language"
                options={
                  [
                    {
                      value: 'english',
                      text: 'English'
                    },
                    {
                      value: 'arabic',
                      text: 'Arabic'
                    },
                    {
                      value: 'chinese',
                      text: 'Chinese (Simplified)'
                    },
                    {
                      value: 'french',
                      text: 'French'
                    },
                    {
                      value: 'portuguese',
                      text: 'Portuguese'
                    },
                    {
                      value: 'russian',
                      text: 'Russian'
                    },
                    {
                      value: 'spanish',
                      text: 'Spanish'
                    }
                  ]
                }
                required
                autoFocus
                value="english"
                name="language"
              />

              <Form.Field
                id="video-subtitles"
                control={ Select }
                label="Subtitles & Captions"
                options={
                  [
                    {
                      value: 'clean',
                      text: 'Clean'
                    },
                    {
                      value: 'subtitles',
                      text: 'Subtitles'
                    }
                  ]
                }
                required
                autoFocus
                value="clean"
                name="subtitles"
              />

              <Form.Field
                id="video-type"
                control={ Select }
                label="Video Type"
                options={
                  [
                    {
                      value: 'full',
                      text: 'Full Video'
                    },
                    {
                      value: 'teaser',
                      text: 'Promotional Teaser'
                    },
                    {
                      value: 'embargoed',
                      text: 'Embargoed'
                    }
                  ]
                }
                required
                autoFocus
                value="full"
                name="type"
              />

              <Form.Field
                id="video-quality"
                control={ Select }
                label={ videoQuality }
                options={
                  [
                    {
                      value: 'web',
                      text: 'For web'
                    },
                    {
                      value: 'broadcast',
                      text: 'For broadcast'
                    }
                  ]
                }
                required
                autoFocus
                value="web"
                name="quality"
              />
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

VideoBasicDataForm.propTypes = {
  data: object
};

const CURRENT_VIDEO_UNIT = gql`
  query CURRENT_VIDEO_UNIT( $id: ID! ) {
    videoUnit( id: $id ) {
      title
      descPublic
    }
  } 
`;

export default graphql( CURRENT_VIDEO_UNIT, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( VideoBasicDataForm );

// export default VideoBasicDataForm;
