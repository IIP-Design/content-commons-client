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
  Form, Grid, Input, Select, Loader
} from 'semantic-ui-react';

import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';

import './FileDataForm.scss';

class FileDataForm extends Component {
  state = {
    language: {},
    quality: 'WEB',
    subtitles: 'CLEAN'
  }

  componentDidMount() {
    const { file } = this.props.data;

    if ( file ) {
      this.setState( {
        language: file.language,
        quality: file.quality,
        subtitles: file.videoBurnedInStatus,
        use: file.use.name
      } );
    }
  }

  getProjectData = () => {}

  handleInput = e => {
    this.setState( {
      [e.target.name]: e.target.value
    } );
  }

  updateUnit = e => {
    const { id } = this.props;
    const { name } = e.target;

    this.props[`${name}VideoUnitMutation`]( {
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
          iconType="info circle"
          id="video-quality"
          message="Web: small - for social sharing, Broadcast: large - ambassador videos"
          size="small"
        />
      </label>
    );

    // const {
    //   data: { error, loading, file }
    // } = this.props;

    // const {
    //   language, quality, subtitles
    // } = this.state;

    // if ( error ) return `Error! ${error.message}`;
    // if ( !file || loading ) {
    //   return (
    //     <div style={ {
    //       display: 'flex',
    //       flexDirection: 'column',
    //       alignItems: 'center',
    //       justifyContent: 'center',
    //       height: '100vh'
    //     } }
    //     >
    //       <Loader active inline="centered" style={ { marginBottom: '1em' } } />
    //       <p>Loading the file data...</p>
    //     </div>
    //   );
    // }

    // console.log( file );

    const { language, quality, subtitles } = this.state;

    return (
      <Form className="edit-video__form video-file-form">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column className="video-file-form-col-1" mobile={ 16 } computer={ 8 }>
              <div className="modal_meta">
                { /* <span className="modal_meta_content modal_meta_content--filetype">
                  { file.filename }
                </span>
                <span className="modal_meta_content modal_meta_content--filesize">
                  { `Filesize: ${file.filesize}` }
                </span>
                <span className="modal_meta_content modal_meta_content--dimensions">
                  { `Dimensions: ${file.dimensions.width} x ${file.dimensions.height}` }
                </span>
                <span className="modal_meta_content modal_meta_content--duration">
                  { `Duration: ${file.duration}` }
                </span> */ }
              </div>
              <div className="video-links">
                <Form.Field
                  id="video-youtube"
                  control={ Input }
                  label="YouTube URL"
                  autoFocus
                  name="youtube"
                  // value={ videoTitle }
                  // onChange={ handleChange }
                />

                <Form.Field
                  id="video-description"
                  control={ Input }
                  label="Vimeo URL"
                  autoFocus
                  name="vimeo"
                />
              </div>
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 8 }>
              <Form.Field
                control={ Select }
                id="video-language"
                label="Language"
                name="language"
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
                value="english"
              />

              <Form.Field
                control={ Select }
                id="video-subtitles"
                label="Subtitles & Captions"
                name="subtitles"
                onChange={ this.handleInput }
                options={
                  [
                    {
                      value: 'CLEAN',
                      text: 'Clean'
                    },
                    {
                      value: 'SUBTITLED',
                      text: 'Subtitles'
                    }
                  ]
                }
                required
                value={ subtitles }
              />

              <Form.Select
                id="video-type"
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
                selection="full"
                value="full"
                name="type"
              />

              <Form.Field
                control={ Select }
                id="video-quality"
                label={ videoQuality }
                name="quality"
                options={
                  [
                    {
                      value: 'WEB',
                      text: 'For web'
                    },
                    {
                      value: 'BROADCAST',
                      text: 'For broadcast'
                    }
                  ]
                }
                required
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
  file: propTypes.object,
  id: propTypes.string
};

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
      use {
        name
      }
    }
  }
`;

const currentVideoFile = graphql( VIDEO_FILE_QUERY, {
  options: {
    variables: {
      id: 'cju34dnpw002p087504alx7bg'
    },
  }
} );

const VIDEO_UNIT_DESC_MUTATION = gql`
  mutation VIDEO_UNIT_DESC_MUTATION( $id: ID!, $descPublic: String ) {
    updateVideoUnit(
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

const VIDEO_UNIT_TITLE_MUTATION = gql`
  mutation VIDEO_UNIT_TITLE_MUTATION( $id: ID!, $title: String ) {
    updateVideoUnit(
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

export default compose(
  graphql( VIDEO_UNIT_DESC_MUTATION, { name: 'descPublicVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_TITLE_MUTATION, { name: 'titleVideoUnitMutation' } ),
  currentVideoFile
)( FileDataForm );
