import React, { Component } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';

import FileSidebar from 'components/admin/projects/ProjectEdit/VideoEditVideo/FileSidebar';
import FileDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/FileDataForm';

import './FileSection.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      id
      files {
        id
      }
      language {
        displayName
      }
    }
  } 
`;

class FileSection extends Component {
  state = {}

  componentDidUpdate= ( prevProps, prevState ) => {
    const { videoUnitQuery } = this.props;

    let fileId = '';
    if (
      videoUnitQuery.videoUnit
      && videoUnitQuery.videoUnit.files
      && videoUnitQuery.videoUnit.files[0].id
    ) {
      fileId = videoUnitQuery.videoUnit.files[0].id;
    }

    if ( fileId && fileId !== prevState.selected ) {
      this.setState( {
        selected: fileId
      } );
    }
  }

  handleFileChoice = id => {
    this.setState( {
      selected: id
    } );
  }

  render() {
    const { unitId, videoUnitQuery } = this.props;
    const { selected } = this.state;

    let lang = '';
    if (
      videoUnitQuery.videoUnit
      && videoUnitQuery.videoUnit.language
      && videoUnitQuery.videoUnit.language.displayName
    ) {
      lang = `in ${videoUnitQuery.videoUnit.language.displayName}`;
    }

    return (
      <section className="edit-file">
        <h4>{ `File Data ${lang}` }</h4>
        <div className="edit-file-form-container">
          <FileSidebar callback={ this.handleFileChoice } id={ unitId } selected={ selected } />
          <FileDataForm id={ selected } />
        </div>
      </section>
    );
  }
}

FileSection.propTypes = {
  unitId: propTypes.string,
  videoUnitQuery: propTypes.object
};

export default graphql( VIDEO_UNIT_QUERY, {
  name: 'videoUnitQuery',
  options: props => ( {
    variables: {
      id: props.unitId
    },
  } )
} )( FileSection );
