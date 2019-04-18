/**
 *
 * FileDataForm
 *
 */
import React, { Component } from 'react';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import { Form, Grid, Loader } from 'semantic-ui-react';

import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown';
import QualityDropdown from 'components/admin/dropdowns/QualityDropdown';
import UseDropdown from 'components/admin/dropdowns/UseDropdown';
import VideoBurnedInStatusDropdown from 'components/admin/dropdowns/VideoBurnedInStatusDropdown';
import IconPopup from 'components/popups/IconPopup/IconPopup';

import './FileDataForm.scss';

const VIDEO_FILE_QUERY = gql`
  query VIDEO_FILE_QUERY( $id: ID! ) {
    file: videoFile( id: $id ) {
      id
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
      stream {
        id
        site
        url
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

const VIDEO_FILE_CREATE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_CREATE_STREAM_MUTATION( $id: ID!, $site: String!, $url: String! ) {
    updateVideoFile(
      data: { 
        stream: {
          create: {
            site: $site,
            url: $url
          }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
    }
  }
`;

const VIDEO_FILE_UPDATE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_UPDATE_STREAM_MUTATION( $id: ID!, $streamId: ID! $url: String! ) {
    updateVideoFile(
      data: {
        stream: {
          update: {
            data: {
              url: $url
            },
            where: {
              id: $streamId
            }
          }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
    }
  }
`;

const VIDEO_FILE_DELETE_STREAM_MUTATION = gql`
  mutation VIDEO_FILE_DELETE_STREAM_MUTATION( $id: ID!, $streamId: ID! ) {
    updateVideoFile(
      data: {
        stream: {
          delete: { id: $streamId }
        }
      },
      where: { id: $id }
    ) {
      id
      stream { id }
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
        streams: this.getStreamObjects( file.stream ),
        videoBurnedInStatus: file.videoBurnedInStatus,
        use: file.use.id
      } );
    }
  }

  getStreamObjects = streamList => {
    const streams = [];

    if ( streamList && streamList.length > 0 ) {
      streamList.forEach( stream => {
        if ( stream.site === 'youtube' || stream.site === 'vimeo' ) {
          const obj = {
            [stream.site]: {
              id: stream.id,
              url: stream.url
            }
          };
          streams.push( obj );
          return streams;
        }
      } );
    }

    const streamObj = streams.reduce( ( obj, item ) => {
      const key = Object.keys( item )[0];
      obj[key] = item[key];
      return obj;
    }, {} );

    return streamObj;
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

  updateStreams = e => {
    const unitId = this.props.id;
    const { name } = e.target;
    const { streams } = this.state;

    if ( streams[name] ) {
      const { url } = streams[name];
      const streamId = streams[name].id;

      if ( streamId && url !== '' ) {
        this.props.streamUpdateVideoFileMutation( {
          variables: {
            id: unitId,
            streamId,
            url
          }
        } );
      } else if ( streamId && url === '' ) {
        this.props.streamDeleteVideoFileMutation( {
          variables: {
            id: unitId,
            streamId
          }
        } );
      } else {
        this.props.streamCreateVideoFileMutation( {
          variables: {
            id: unitId,
            site: name,
            url
          }
        } );
      }
    }

    this.props.videoFileQuery.refetch();
  }

  handleStreamsInputChange = e => {
    const { name, value } = e.target;
    this.setState( prevState => ( {
      streams: {
        ...prevState.streams,
        [name]: {
          ...prevState.streams[name],
          url: value
        }
      }
    } ) );
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
      language, quality, streams, use, videoBurnedInStatus
    } = this.state;

    const youtube = streams && streams.youtube ? streams.youtube : {};
    const vimeo = streams && streams.vimeo ? streams.vimeo : {};

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
                <Form.Input
                  id="video-youtube"
                  label="YouTube URL"
                  name="youtube"
                  onBlur={ this.updateStreams }
                  onChange={ this.handleStreamsInputChange }
                  value={ youtube.url ? youtube.url : '' }
                />

                <Form.Input
                  id="video-vimeo"
                  label="Vimeo URL"
                  name="vimeo"
                  onBlur={ this.updateStreams }
                  onChange={ this.handleStreamsInputChange }
                  value={ vimeo.url ? vimeo.url : '' }
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
  streamCreateVideoFileMutation: propTypes.func,
  streamDeleteVideoFileMutation: propTypes.func,
  streamUpdateVideoFileMutation: propTypes.func,
  videoFileQuery: propTypes.object
};

export default compose(
  graphql( VIDEO_FILE_DELETE_STREAM_MUTATION, { name: 'streamDeleteVideoFileMutation' } ),
  graphql( VIDEO_FILE_UPDATE_STREAM_MUTATION, { name: 'streamUpdateVideoFileMutation' } ),
  graphql( VIDEO_FILE_CREATE_STREAM_MUTATION, { name: 'streamCreateVideoFileMutation' } ),
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
