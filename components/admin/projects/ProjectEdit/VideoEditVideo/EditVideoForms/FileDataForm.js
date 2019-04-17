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
  mutation VIDEO_FILE_LANG_MUTATION( $id: ID!, $language: ID! ) {
    updateVideoFile(
      data: {
        language: {
          connect: { id: $language }
        }
      },
      where: { id: $id }
    ) {
      id
      language { id }
    }
  }
`;

const VIDEO_FILE_SUBTITLES_MUTATION = gql`
  mutation VIDEO_FILE_SUBTITLES_MUTATION( $id: ID!, $videoBurnedInStatus: VideoBurnedInStatus! ) {
    updateVideoFile(
      data: { videoBurnedInStatus: $videoBurnedInStatus },
      where: { id: $id }
    ) {
      id
      videoBurnedInStatus
    }
  }
`;

const VIDEO_FILE_USE_MUTATION = gql`
  mutation VIDEO_FILE_USE_MUTATION( $id: ID!, $use: ID! ) {
    updateVideoFile(
      data: {
        use: {
          connect: { id: $use }
        }
      },
      where: { id: $id }
    ) {
      id
      use { id }
    }
  }
`;

const VIDEO_FILE_QUALITY_MUTATION = gql`
  mutation VIDEO_FILE_QUALITY_MUTATION( $id: ID!, $quality: VideoQuality! ) {
    updateVideoFile(
      data: { quality: $quality },
      where: { id: $id }
    ) {
      id
      quality
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
        videoBurnedInStatus: file.videoBurnedInStatus,
        use: file.use.id
      } );
    }
  }

  updateUnit = ( name, value ) => {
    const { id } = this.props;

    this.props[`${name}VideoFileMutation`]( {
      variables: {
        id,
        [name]: value
      }
    } );

    this.props.videoFileQuery.refetch();
  }

  handleInputChange = e => {
    this.setState( {
      [e.target.name]: e.target.value
    } );
  }

  handleInputSave = e => {
    const { name } = e.target;
    const value = this.state[name];

    this.updateUnit( name, value );
  }

  handleDropdownSave = ( e, data ) => {
    const { name, value } = data;

    this.setState(
      { [name]: value },
      () => this.updateUnit( name, value )
    );
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
      language, quality, use, videoBurnedInStatus
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
                onChange={ this.handleDropdownSave }
                label="Language"
                required
                value={ language }
              />

              <VideoBurnedInStatusDropdown
                id="video-subtitles"
                label="Subtitles & Captions"
                onChange={ this.handleDropdownSave }
                required
                type="video"
                value={ videoBurnedInStatus }
              />

              <UseDropdown
                id="video-use"
                label="Video Type"
                onChange={ this.handleDropdownSave }
                required
                type="video"
                value={ use }
              />

              <QualityDropdown
                id="video-quality"
                label={ videoQuality }
                onChange={ this.handleDropdownSave }
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
  id: propTypes.string,
  videoFileQuery: propTypes.object
};

export default compose(
  graphql( VIDEO_FILE_QUALITY_MUTATION, { name: 'qualityVideoFileMutation' } ),
  graphql( VIDEO_FILE_USE_MUTATION, { name: 'useVideoFileMutation' } ),
  graphql( VIDEO_FILE_SUBTITLES_MUTATION, { name: 'videoBurnedInStatusVideoFileMutation' } ),
  graphql( VIDEO_FILE_LANG_MUTATION, { name: 'languageVideoFileMutation' } ),
  graphql( VIDEO_FILE_QUERY, {
    name: 'videoFileQuery',
    options: props => ( {
      variables: { id: props.id },
    } )
  } )
)( FileDataForm );
