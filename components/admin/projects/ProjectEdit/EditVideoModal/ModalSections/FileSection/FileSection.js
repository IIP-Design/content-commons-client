import React, { Component } from 'react';
import propTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loader } from 'semantic-ui-react';

import FileSidebar from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/FileSidebar/FileSidebar';
import FileDataForm from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalForms/FileDataForm/FileDataForm';

import './FileSection.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      files {
        id
      }
      language {
        id
        displayName
      }
    }
  } 
`;

class FileSection extends Component {
  state = {}

  componentDidUpdate= ( prevProps, prevState ) => {
    const { videoUnitQuery } = this.props;

    const fileId = videoUnitQuery.unit && videoUnitQuery.unit.files && videoUnitQuery.unit.files[0].id
      ? videoUnitQuery.unit.files[0].id
      : '';

    const prevId = prevProps.videoUnitQuery && prevProps.videoUnitQuery.unit && prevProps.videoUnitQuery.unit.files && prevProps.videoUnitQuery.unit.files[0].id
      ? prevProps.videoUnitQuery.unit.files[0].id
      : '';

    if ( fileId && fileId !== prevId && fileId !== prevState.selected ) {
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
    const { loading, unit } = videoUnitQuery;

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
          <p>Loading the file data...</p>
        </div>
      );
    }

    const { selected } = this.state;
    const lang = unit.language && unit.language.displayName ? `in ${unit.language.displayName}` : '';

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
