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
      language {
        displayName
      }
    }
  } 
`;

class FileSection extends Component {
  state = { selected: '' }

  componentDidMount() {
    const { fileId } = this.props;

    if ( fileId ) {
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
  fileId: propTypes.string,
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
