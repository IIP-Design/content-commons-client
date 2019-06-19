import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { Embed, Form, Grid } from 'semantic-ui-react';
import getConfig from 'next/config';

import Loader from 'components/admin/projects/ProjectEdit/EditVideoModal/Loader/Loader';
import TagTypeahead from 'components/admin/dropdowns/TagTypeahead';
import { getStreamData, getVimeoId, getYouTubeId } from 'lib/utils';

const { publicRuntimeConfig } = getConfig();

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

    if ( unit && unit !== prevProps.videoUnitQuery.unit ) {
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
    const value = this.state[name];

    this.props[`${name}VideoUnitMutation`]( {
      variables: {
        id: unitId,
        [name]: value
      },
      update: ( cache, { data: { updateVideoUnit } } ) => {
        try {
          const cachedData = cache.readQuery( {
            query: VIDEO_UNIT_QUERY,
            variables: { id: unitId }
          } );

          cachedData.unit[name] = value;
          cache.writeQuery( {
            query: VIDEO_UNIT_QUERY,
            data: { unit: cachedData.unit }
          } );
        } catch ( error ) {
          console.log( error );
        }
      }
    } );
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

    // Converts the array of tag ids into an array of tag objects as expected by apollo
    const newTagsArr = [];
    newTags.forEach( newTag => {
      const obj = { id: newTag, __typename: 'Tag' };
      newTagsArr.push( obj );
    } );

    const runTagMutation = ( arr, mutation ) => {
      arr.map( tag => (
        mutation( {
          variables: {
            id: unitId,
            tagId: tag
          },
          update: ( cache, { data: { updateVideoUnit } } ) => {
            try {
              const cachedData = cache.readQuery( {
                query: VIDEO_UNIT_QUERY,
                variables: { id: unitId }
              } );

              cachedData.unit.tags = newTagsArr;
              cache.writeQuery( {
                query: VIDEO_UNIT_QUERY,
                data: { unit: cachedData.unit }
              } );
            } catch ( error ) {
              console.log( error );
            }
          }
        } )
      ) );
    };

    if ( removed.length > 0 ) {
      runTagMutation( removed, this.props.tagsRemoveVideoUnitMutation );
    }

    if ( added.length > 0 ) {
      runTagMutation( added, this.props.tagsAddVideoUnitMutation );
    }
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

    if ( !unit || loading ) return <Loader height="340px" text="Loading the video data..." />;

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
      thumbnailUrl = `https://${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET}/${unit.thumbnails[0].image.url}`;
      thumbnailAlt = unit.thumbnails[0].image.alt || '';
    }

    return (
      <Form className="edit-video__form video-unit-data">
        <Grid stackable className="aligned">
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 9 }>
              { ( vimeoUrl ) && (
                <Embed
                  autoplay={ false }
                  id={ getVimeoId( vimeoUrl ) }
                  placeholder={ thumbnailUrl }
                  source="vimeo"
                />
              ) }
              { !vimeoUrl && youTubeUrl && (
                <Embed
                  autoplay={ false }
                  id={ getYouTubeId( youTubeUrl ) }
                  placeholder={ thumbnailUrl }
                  source="youtube"
                />
              ) }
              { ( !youTubeUrl && !vimeoUrl ) && (
                <figure className="modal_thumbnail overlay">
                  <img className="overlay-image" src={ thumbnailUrl } alt={ thumbnailAlt } />
                </figure>
              ) }
            </Grid.Column>
            <Grid.Column mobile={ 16 } computer={ 7 }>
              <Form.Input
                id="video-title"
                label={ `Video Title ${lang}` }
                name="title"
                onBlur={ this.updateUnit }
                onChange={ this.handleInput }
                value={ title }
              />

              <Form.TextArea
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
