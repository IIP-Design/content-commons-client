/**
 *
 * BasicForm
 *
 */

import React, { Component } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { object, string } from 'prop-types';

import {
  Form, Grid, Select, Loader
} from 'semantic-ui-react';

import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';

class BasicForm extends Component {
  state = {
    descPublic: '',
    language: {},
    quality: 'WEB',
    subtitles: 'CLEAN',
    title: ''
  }

  componentDidMount() {
    // this.getProjectData();
  }

  getProjectData = () => {
    const { unit } = this.props.data;

    if ( unit ) {
      const file = unit.files[0];

      this.setState( {
        descPublic: unit.descPublic,
        language: unit.language,
        quality: file.quality,
        subtitles: file.videoBurnedInStatus,
        title: unit.title,
        use: file.use.name
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

    this.props[`${name}UpdateVideoUnit`]( {
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

    const {
      data: { error, loading, file }
    } = this.props;

    const {
      language, quality, subtitles
    } = this.state;

    if ( error ) return `Error! ${error.message}`;
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

    console.log( file );

    return (
      <Form className="edit-video__form video-basic-data">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 8 }>
              <section>
                <p>{ file.filename }</p>
                <p>{ `Filesize: ${file.filesize}` }</p>
                <p>{ `Dimensions: ${file.dimensions.width} x ${file.dimensions.height}` }</p>
                <p>{ `Duration: ${file.duration}` }</p>
              </section>
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
                    },
                    {
                      value: 'CAPTIONED',
                      text: 'Captions'
                    }
                  ]
                }
                required
                value={ subtitles }
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

BasicForm.propTypes = {
  data: object,
  id: string
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

const UPDATE_VIDEO_UNIT_DESC = gql`
  mutation UPDATE_VIDEO_UNIT_DESC( $id: ID!, $descPublic: String ) {
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

const UPDATE_VIDEO_UNIT_TITLE = gql`
  mutation UPDATE_VIDEO_UNIT_TITLE( $id: ID!, $title: String ) {
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
  graphql( UPDATE_VIDEO_UNIT_DESC, { name: 'descPublicUpdateVideoUnit' } ),
  graphql( UPDATE_VIDEO_UNIT_TITLE, { name: 'titleUpdateVideoUnit' } ),
  currentVideoFile
)( BasicForm );
