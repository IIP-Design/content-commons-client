import React, { Component } from 'react';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';
import gql from 'graphql-tag';

import {
  Form, Grid, Input, Loader, TextArea
} from 'semantic-ui-react';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      title
      descPublic
      language {
        id
        displayName
      }
      tags {
        id
        translations {
          name
          language { displayName }
        }
      }
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

const VIDEO_UNIT_TAG_MUTATION = gql`
  mutation VIDEO_UNIT_TAG_MUTATION( $id: ID!, $descPublic: String ) {
    updateVideoUnit(
      data: {
        descPublic: $descPublic
      },
      where: {
        id: $id
      }
    ) {
      id
      descPublic
    }
  }
`;

class UnitDataForm extends Component {
  state = {}

  componentDidUpdate = prevProps => {
    const { unit } = this.props.videoUnitQuery;

    if ( unit !== prevProps.videoUnitQuery.unit ) {
      this.setState( {
        descPublic: unit.descPublic,
        imageAlt: unit.thumbnails[0].image.alt,
        imageUrl: unit.thumbnails[0].image.url,
        // tag: unit.tag,
        title: unit.title
      } );
    }
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

  handleInput = e => {
    this.setState( {
      [e.target.name]: e.target.value
    } );
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

    const lang = `in ${unit.language.displayName}` || '';
    const {
      descPublic, imageAlt, imageUrl, title
    } = this.state;

    return (
      <Form className="edit-video__form video-basic-data">
        <Grid stackable className="aligned">
          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 9 }>
              <figure className="modal_thumbnail overlay">
                <img className="overlay-image" src={ imageUrl } alt={ imageAlt } />
                <div className="overlay-hover">
                  <div className="overlay-text">Change Thumbnail</div>
                </div>
              </figure>
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

              { /* <Form.Field
                control={ Input }
                id="video-tags"
                label={ `Additional Keywords ${lang}` }
                name="tag"
                // onChange={ this.handleInput }
              /> */ }
            </Grid.Column>
          </Grid.Row>
        </Grid>
      </Form>
    );
  }
}

UnitDataForm.propTypes = {
  unitId: propTypes.string,
  unit: propTypes.object,
  videoUnitQuery: propTypes.object
};


export default compose(
  graphql( VIDEO_UNIT_TAG_MUTATION, { name: 'tagVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_DESC_MUTATION, { name: 'descPublicVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_TITLE_MUTATION, { name: 'titleVideoUnitMutation' } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: props => ( {
      variables: { id: props.unitId },
    } )
  } )
)( UnitDataForm );
