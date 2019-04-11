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
      title
      descPublic
      thumbnails {
        image {
          alt
          url
        }
      }
    }
  } 
`;

class UnitDataForm extends Component {
  render() {
    const { id } = this.props;

    return (
      <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
        { ( { loading, error, data } ) => {
          const { unit } = data;

          if ( error ) return `Error! ${error.message}`;
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

          const { image } = unit.thumbnails[0];

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
                      label="Video Title in Language"
                      name="title"
                      // onBlur={ this.updateUnit }
                      // onChange={ this.handleInput }
                      value={ unit.title }
                    />

                    <Form.Field
                      control={ TextArea }
                      id="video-description"
                      label="Public Description in Language"
                      name="descPublic"
                      // onBlur={ this.updateUnit }
                      // onChange={ this.handleInput }
                      value={ unit.descPublic }
                    />

                    <Form.Field
                      control={ Input }
                      id="video-keywords"
                      label="Additional Keywords in Language"
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
