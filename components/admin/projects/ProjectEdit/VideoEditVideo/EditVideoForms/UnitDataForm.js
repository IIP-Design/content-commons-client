import React, { Component } from 'react';
import { Query } from 'react-apollo';
import { string } from 'prop-types';
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
        displayName
      }
      thumbnails {
        image {
          alt
          url
        }
      }
    }
  } 
`;

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

class UnitDataForm extends Component {
  updateUnit = e => {
    // const { id } = this.props;
    // const { name } = e.target;

    // this.props[`${name}VideoUnitMutation`]( {
    //   variables: {
    //     id,
    //     [name]: this.state[name]
    //   }
    // } );

    // this.props.unit.refetch();
  }

  render() {
    const { id } = this.props;

    return (
      <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( error ) return `Error! ${error.message}`;
          if ( !data || loading ) {
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

          const { unit } = data;
          const { image } = unit.thumbnails[0];
          const lang = `in ${unit.language.displayName}` || '';

          return (
            <Form className="edit-video__form video-basic-data">
              <Grid stackable className="aligned">
                <Grid.Row>
                  <Grid.Column mobile={ 16 } computer={ 9 }>
                    <figure className="modal_thumbnail overlay">
                      <img className="overlay-image" src={ image.url } alt={ image.alt } />
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
                      // onBlur={ this.updateUnit }
                      // onChange={ this.handleInput }
                      value={ unit.title }
                    />

                    <Form.Field
                      control={ TextArea }
                      id="video-description"
                      label={ `Public Description ${lang}` }
                      name="descPublic"
                      // onBlur={ this.updateUnit }
                      // onChange={ this.handleInput }
                      value={ unit.descPublic }
                    />

                    <Form.Field
                      control={ Input }
                      id="video-keywords"
                      label={ `Additional Keywords ${lang}` }
                      name="keywords"
                      // onChange={ this.handleInput }
                    />
                  </Grid.Column>
                </Grid.Row>
              </Grid>
            </Form>
          );
        } }
      </Query>
    );
  }
}

UnitDataForm.propTypes = {
  id: string
};

export default UnitDataForm;
