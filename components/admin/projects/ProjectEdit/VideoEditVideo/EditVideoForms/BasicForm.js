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
  Form, Grid, Input, Select, Loader, TextArea
} from 'semantic-ui-react';

import IconPopup from 'components/admin/projects/ProjectEdit/IconPopup/IconPopup';

class BasicForm extends Component {
  state = {
    descPublic: '',
    language: {},
    title: ''
  }

  componentDidMount() {
    this.getProjectData();
  }

  getProjectData = () => {
    const { unit } = this.props.data;

    if ( unit ) {
      this.setState( {
        descPublic: unit.descPublic,
        language: unit.language,
        title: unit.title
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
      data: { error, loading, unit }
    } = this.props;

    const { descPublic, language, title } = this.state;

    if ( !unit || loading ) {
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
          <p>Loading the project...</p>
        </div>
      );
    }

    if ( error ) return `Error! ${error.message}`;

    return (
      <Form className="edit-video__form video-basic-data">
        <Grid stackable>
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 10 }>
              <Form.Field
                autoFocus
                control={ Input }
                id="video-title"
                label="Video Title in Language"
                name="title"
                onBlur={ this.updateUnit }
                onChange={ this.handleInput }
                value={ title }
              />

              <Form.Field
                autoFocus
                control={ TextArea }
                id="video-description"
                label="Public Description in Language (e.g. - YouTube)"
                name="descPublic"
                onBlur={ this.updateUnit }
                onChange={ this.handleInput }
                value={ descPublic }
              />

              <Form.Field
                autoFocus
                control={ Input }
                id="video-keywords"
                label="Additional Keywords in Language"
                name="keywords"
                onChange={ this.handleInput }
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

BasicForm.propTypes = {
  data: object,
  id: string
};

const CURRENT_VIDEO_UNIT = gql`
  query CURRENT_VIDEO_UNIT( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      title
      descPublic
      language {
        displayName
      }
    }
  } 
`;

const currentVideoUnit = graphql( CURRENT_VIDEO_UNIT, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
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
  currentVideoUnit
)( BasicForm );
