import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  Embed, Form, Grid, Input, Loader, TextArea
} from 'semantic-ui-react';

import TagTypeahead from 'components/admin/dropdowns/TagTypeahead';
import { getStreamData, getVimeoId, getYouTubeId } from 'lib/utils';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      title
      descPublic
      language {
        id
        displayName
        locale
      }
      tags { id }
      thumbnails {
        image {
          id
          alt
          url
        }
      }
    }
  } 
`;

const VIDEO_FILE_QUERY = gql`
  query VIDEO_FILE_QUERY( $id: ID! ) {
    file: videoFile( id: $id ) {
      id
      stream {
        id
        site
        url
      }
    }
  }
`;

const VIDEO_UNIT_TITLE_MUTATION = gql`
  mutation VIDEO_UNIT_TITLE_MUTATION( $id: ID!, $title: String ) {
    updateVideoUnit(
      data: { title: $title },
      where: { id: $id }
    ) {
      id
      title
    }
  }
`;

const VIDEO_UNIT_DESC_MUTATION = gql`
  mutation VIDEO_UNIT_DESC_MUTATION( $id: ID!, $descPublic: String ) {
    updateVideoUnit(
      data: { descPublic: $descPublic },
      where: { id: $id }
    ) {
      id
      descPublic
    }
  }
`;

const VIDEO_UNIT_ADD_TAG_MUTATION = gql`
  mutation VIDEO_UNIT_ADD_TAG_MUTATION( $id: ID!, $tagId: ID! ) {
    updateVideoUnit(
      data: {
        tags: {
          connect: {
            id: $tagId
          }
        }
      },
      where: { id: $id }
    ) {
      id
      tags { id }
    }
  }
`;

const VIDEO_UNIT_REMOVE_TAG_MUTATION = gql`
  mutation VIDEO_UNIT_REMOVE_TAG_MUTATION( $id: ID!, $tagId: ID! ) {
    updateVideoUnit(
      data: {
        tags: {
          disconnect: {
            id: $tagId
          }
        }
      },
      where: { id: $id }
    ) {
      id
      tags { id }
    }
  }
`;

class UnitDataForm extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    const { unit } = this.props.videoUnitQuery;

    if ( unit !== prevProps.videoUnitQuery.unit ) {
      this.setState( {
        descPublic: unit.descPublic || '',
        tags: this.getTagList( unit.tags ),
        title: unit.title || ''
      } );
    }
  }

  getTagList = arr => {
    const tagList = [];
    arr.map( tag => {
      tagList.push( tag.id );
      return tagList;
    } );
    return tagList;
  }

  updateUnit = e => {
    const { unitId } = this.props;
    const { name } = e.target;

    this.props[`${name}VideoUnitMutation`]( {
      variables: {
        id: unitId,
        [name]: this.state[name]
      }
    } );

    this.props.videoUnitQuery.refetch();
  }

  updateTags = newTags => {
    const { tags } = this.props.videoUnitQuery.unit;
    const { unitId } = this.props;

    const currentTags = [];
    tags.forEach( tag => (
      currentTags.push( tag.id )
    ) );

    const removed = currentTags.filter( item => newTags.indexOf( item ) === -1 );
    const added = newTags.filter( item => currentTags.indexOf( item ) === -1 );

    if ( added.length > 0 ) {
      added.map( tag => (
        this.props.tagsAddVideoUnitMutation( {
          variables: {
            id: unitId,
            tagId: tag
          }
        } )
      ) );
    }

    if ( removed.length > 0 ) {
      removed.map( tag => (
        this.props.tagsRemoveVideoUnitMutation( {
          variables: {
            id: unitId,
            tagId: tag
          }
        } )
      ) );
    }

    this.props.videoUnitQuery.refetch();
  }

  handleInput = e => {
    this.setState( {
      [e.target.name]: e.target.value
    } );
  }

  handleDropdownSelection = ( e, data ) => {
    const { name, value } = data;

    this.setState(
      { [name]: value },
      () => this.updateTags( value )
    );
  }

  render() {
    const { loading, unit } = this.props.videoUnitQuery;
    const { file } = this.props.videoFileQuery;

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
          <p>Loading the video data...</p>
        </div>
      );
    }

    const lang = `in ${unit.language.displayName}` || '';
    const {
      descPublic, tags, title
    } = this.state;

    let youTubeUrl = '';
    let vimeoUrl = '';
    if ( file && file.stream ) {
      youTubeUrl = getStreamData( file.stream, 'youtube', 'url' );
      vimeoUrl = getStreamData( file.stream, 'vimeo', 'url' );
    }

    let thumbnailUrl = '';
    let thumbnailAlt = '';
    if ( unit.thumbnails && unit.thumbnails.length ) {
      thumbnailUrl = `https://staticcdp.s3.amazonaws.com/${unit.thumbnails[0].image.url}`;
      thumbnailAlt = unit.thumbnails[0].image.alt || '';
    }

    return (
      <Form className="edit-video__form video-unit-data">
        <Grid stackable className="aligned">
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 9 }>
              { youTubeUrl && (
                <Embed
                  autoplay={ false }
                  id={ getYouTubeId( youTubeUrl ) }
                  placeholder={ thumbnailUrl }
                  source="youtube"
                />
              ) }
              { ( !youTubeUrl && vimeoUrl ) && (
                <Embed
                  autoplay={ false }
                  id={ getVimeoId( vimeoUrl ) }
                  placeholder={ thumbnailUrl }
                  source="vimeo"
                />
              ) }
              { ( !youTubeUrl && !vimeoUrl ) && (
                <figure className="modal_thumbnail overlay">
                  <img className="overlay-image" src={ thumbnailUrl } alt={ thumbnailAlt } />
                </figure>
              ) }
            </Grid.Column>
            <Grid.Column mobile={ 16 } computer={ 7 }>
              <Form.Field
                control={ Input }
                id="video-title"
                label={ `Video Title ${lang}` }
                name="title"
                onBlur={ this.updateUnit }
                onChange={ this.handleInput }
                value={ title }
              />

              <Form.Field
                control={ TextArea }
                id="video-description"
                label={ `Public Description ${lang}` }
                name="descPublic"
                onBlur={ this.updateUnit }
                onChange={ this.handleInput }
                value={ descPublic }
              />

              <TagTypeahead
                onChange={ this.handleDropdownSelection }
                id="video-tags"
                label={ `Additional Keywords ${lang}` }
                locale={ unit.language.locale }
                value={ tags }
              />

            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

UnitDataForm.propTypes = {
  tagsAddVideoUnitMutation: propTypes.func,
  tagsRemoveVideoUnitMutation: propTypes.func,
  unitId: propTypes.string,
  unit: propTypes.object,
  videoFileQuery: propTypes.object,
  videoUnitQuery: propTypes.object
};


export default compose(
  graphql( VIDEO_UNIT_REMOVE_TAG_MUTATION, { name: 'tagsRemoveVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_ADD_TAG_MUTATION, { name: 'tagsAddVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_DESC_MUTATION, { name: 'descPublicVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_TITLE_MUTATION, { name: 'titleVideoUnitMutation' } ),
  graphql( VIDEO_FILE_QUERY, {
    name: 'videoFileQuery',
    options: props => ( {
      variables: { id: props.fileId },
    } )
  } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: props => ( {
      variables: { id: props.unitId },
    } )
  } )
)( UnitDataForm );
