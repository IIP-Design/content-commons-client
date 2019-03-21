/**
 *
 * VideoBasicDataForm
 *
 */

import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import { string } from 'prop-types';

import {
  Form,
  Grid,
  Input,
  Select,
  TextArea
} from 'semantic-ui-react';

import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';

const CURRENT_VIDEO_UNIT = gql`
  query CURRENT_VIDEO_UNIT( $id: ID! ) {
    videoUnit( id: $id ) {
      title
      descPublic
    }
  } 
`;

const VideoBasicDataForm = ( { id } ) => {
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

  return (
    <Form className="edit-video__form video-basic-data">
      <Query query={ CURRENT_VIDEO_UNIT } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;
          const { videoUnit } = data;
          return (
            <Grid stackable>
              <Grid.Row>
                <Grid.Column mobile={ 16 } computer={ 10 }>
                  <Form.Field
                    id="video-title"
                    control={ Input }
                    label="Video Title in Language"
                    autoFocus
                    name="title"
                    // value={ videoTitle }
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
          );
        } }
      </Query>
    </Form>
  );
};

VideoBasicDataForm.propTypes = {
  id: string
};

export default VideoBasicDataForm;
