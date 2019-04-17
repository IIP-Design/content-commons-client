/**
 *
 * FileDataForm
 *
 */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';
import {
  Form, Grid, Input, Loader
} from 'semantic-ui-react';

import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import IconPopup from 'components/popups/IconPopup/IconPopup';

import './FileDataForm.scss';

const VIDEO_FILE_QUERY = gql`
  query VIDEO_FILE_QUERY( $id: ID! ) {
    file: videoFile( id: $id ) {
      duration
      filename
      filesize
      quality
      videoBurnedInStatus
      dimensions {
        height
        width
      }
      language {
        id
        displayName
      }
      use {
        id
        name
      }
    }
  }
`;

const VIDEO_FILE_LANG_MUTATION = gql`
  mutation VIDEO_FILE_LANG_MUTATION( $id: ID!, $descPublic: String ) {
    updateVideoFile(
      data: {
        descPublic: $descPublic
      },
      where: {
        id: $id
      }
    ) {
      descPublic
    }
  }
`;

const VIDEO_FILE_SUBTITLES_MUTATION = gql`
  mutation VIDEO_FILE_SUBTITLES_MUTATION( $id: ID!, $use: VideoUse ) {
    updateVideoFile(
      data: {
        use: $title
      },
      where: {
        id: $id
      }
    ) {
      title
    }
  }
`;

const VIDEO_FILE_USE_MUTATION = gql`
  mutation VIDEO_FILE_USE_MUTATION( $id: ID!, $use: VideoUse ) {
    updateVideoFile(
      data: {
        use: $use
      },
      where: {
        id: $id
      }
    ) {
      use
    }
  }
`;

const VIDEO_FILE_QUALITY_MUTATION = gql`
  mutation VIDEO_FILE_QUALITY_MUTATION( $id: ID!, $title: String ) {
    updateVideoFile(
      data: {
        title: $title
      },
      where: {
        id: $id
      }
    ) {
      title
    }
  }
`;

class FileDataForm extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    const { file } = this.props.videoFileQuery;

    if ( file !== prevProps.videoFileQuery.file ) {
      this.setState( {
        language: file.language.id,
        quality: file.quality,
        subtitles: file.videoBurnedInStatus,
        use: file.use.id
      } );
    }
  }

  handleInput = e => {
    this.setState( {
      [e.target.name]: e.target.value
    } );
  }

  updateUnit = e => {
    const { id } = this.props;
    const { name } = e.target;

    this.props[`${name}VideoFileMutation`]( {
      variables: {
        id,
        [name]: this.state[name]
      }
    } );

    this.props.data.refetch();
  }

  render() {
    const videoQuality = (
      <label htmlFor="video-quality"> { /* eslint-disable-line */ }
        Video Quality
        <IconPopup
          iconSize="small"
          iconType="info circle"
          id="video-quality"
          message="Web: small - for social sharing, Broadcast: large - ambassador videos"
          popupSize="small"
        />
      </label>
    );

    const { file, loading } = this.props.videoFileQuery;

    if ( !file || loading ) {
      return (
        <div style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh'
        } }
        >
          <Loader active inline="centered" style={ { marginBottom: '1em' } } />
          <p>Loading the file data...</p>
        </div>
      );
    }

    const {
      language, quality, subtitles, use
    } = this.state;

    return (
      <Form className="edit-video__form video-file-form">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column className="video-file-form-col-1" mobile={ 16 } computer={ 8 }>
              <div className="file_meta">
                <span className="file_meta_content file_meta_content--filetype">
                  { file.filename }
                </span>
                <span className="file_meta_content file_meta_content--filesize">
                  { `Filesize: ${file.filesize}` }
                </span>
                <span className="file_meta_content file_meta_content--dimensions">
                  { `Dimensions: ${file.dimensions.width} x ${file.dimensions.height}` }
                </span>
                <span className="file_meta_content file_meta_content--duration">
                  { `Duration: ${file.duration}` }
                </span>
              </div>
              <div className="video-links">
                <Form.Field
                  id="video-youtube"
                  control={ Input }
                  label="YouTube URL"
                  name="youtube"
                  // value={ videoTitle }
                  // onChange={ handleChange }
                />

                <Form.Field
                  id="video-description"
                  control={ Input }
                  label="Vimeo URL"
                  name="vimeo"
                />
              </div>
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 8 }>
              <LanguageDropdown
                id="video-language"
                label="Language"
                name="language"
                required
                value={ language }
              />

              <VideoBurnedInStatusDropdown
                id="video-subtitles"
                label="Subtitles & Captions"
                name="subtitles"
                required
                type="video"
                value={ subtitles }
              />

              <UseDropdown
                id="video-use"
                label="Video Type"
                required
                type="video"
                value={ use }
              />

              <QualityDropdown
                id="video-quality"
                label={ videoQuality }
                name="quality"
                required
                type="video"
                value={ quality }
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

FileDataForm.propTypes = {
  data: propTypes.object,
  id: propTypes.string,
  videoFileQuery: propTypes.object
};

export default compose(
  graphql( VIDEO_FILE_QUALITY_MUTATION, { name: 'qualityVideoFileMutation' } ),
  graphql( VIDEO_FILE_USE_MUTATION, { name: 'useVideoFileMutation' } ),
  graphql( VIDEO_FILE_SUBTITLES_MUTATION, { name: 'subtitlesVideoFileMutation' } ),
  graphql( VIDEO_FILE_LANG_MUTATION, { name: 'languageVideoFileMutation' } ),
  graphql( VIDEO_FILE_QUERY, {
    name: 'videoFileQuery',
    options: props => ( {
      variables: { id: props.id },
    } )
  } )
)( FileDataForm );
