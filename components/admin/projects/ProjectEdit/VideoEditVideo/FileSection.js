import React, { Component } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import FileSidebar from 'components/admin/projects/ProjectEdit/VideoEditVideo/FileSidebar';
import FileDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/FileDataForm';

import './FileSection.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      thumbnails {
        image {
          url
        }
      }
      files {
        id
        quality
        videoBurnedInStatus
      }
    }
  } 
`;

class FileSection extends Component {
  state = {
    selected: ''
  }

  handleFileChoice = id => {
    this.setState( {
      selected: id
    } );
  }

  render() {
    const { id } = this.props;

    return (
      <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;

          // const { videoUnit } = data;
          const file = data.videoUnit.files[0];
          const { selected } = this.state;

          return (
            <section className="edit-file">
              <h4>{ `${file.quality}, ${file.videoBurnedInStatus}` }</h4>
              <div className="edit-file-form-container">
                <FileSidebar callback={ this.handleFileChoice } id={ id } />
                <FileDataForm id={ selected } />
              </div>
            </section>
          );
        } }
      </Query>
    );
  }
}

FileSection.propTypes = {
  id: propTypes.string
};

export default FileSection;
