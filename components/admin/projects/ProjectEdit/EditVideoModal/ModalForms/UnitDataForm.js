import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import {
  Form, Grid, Loader, TextArea
} from 'semantic-ui-react';

import TagTypeahead from 'components/admin/dropdowns/TagTypeahead';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      title
      descPublic
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
  state = { title: '' }

  componentDidUpdate = prevProps => {
    const { unit } = this.props.videoUnitQuery;

    if ( unit && unit !== prevProps.videoUnitQuery.unit ) {
      const imageUrl = unit.thumbnails
        && unit.thumbnails[0]
        && unit.thumbnails[0].image
        && unit.thumbnails[0].image.url
        ? unit.thumbnails[0].image.url
        : '';

      const imageAlt = unit.thumbnails
        && unit.thumbnails[0]
        && unit.thumbnails[0].image
        && unit.thumbnails[0].image.alt
        ? unit.thumbnails[0].image.alt
        : '';

      this.setState( {
        descPublic: unit.descPublic || '',
        imageAlt,
        imageUrl,
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

    const { language } = this.props;
    const lang = language && language.displayName ? `in ${language.displayName}` : '';
    const locale = language && language.locale ? language.locale : '';
    const {
      descPublic, imageAlt, imageUrl, tags, title
    } = this.state;

    return (
      <Form className="edit-video__form video-basic-data">
        <Grid stackable className="aligned">
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 9 }>
              <figure className="modal_thumbnail overlay">
                <img className="overlay-image" src={ imageUrl } alt={ imageAlt } />
                { /*
                   * Removing change thumbnail hover state
                   * since this functionality not part of MVP
                   *
                  <div className="overlay-hover">
                    <div className="overlay-text">Change Thumbnail</div>
                  </div>
                */ }
              </figure>
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
                locale={ locale }
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
  language: propTypes.object,
  tagsAddVideoUnitMutation: propTypes.func,
  tagsRemoveVideoUnitMutation: propTypes.func,
  unitId: propTypes.string,
  unit: propTypes.object,
  videoUnitQuery: propTypes.object
};


export default compose(
  graphql( VIDEO_UNIT_REMOVE_TAG_MUTATION, { name: 'tagsRemoveVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_ADD_TAG_MUTATION, { name: 'tagsAddVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_DESC_MUTATION, { name: 'descPublicVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_TITLE_MUTATION, { name: 'titleVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: props => ( {
      variables: { id: props.unitId },
    } )
  } )
)( UnitDataForm );
