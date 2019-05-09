/**
 *
 * EditSingleProjectItem
 *
 */
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import propTypes from 'prop-types';

import { Loader } from 'semantic-ui-react';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import EditVideoModal from 'components/admin/projects/ProjectEdit/EditVideoModal/EditVideoModal';

import './EditSingleProjectItem.scss';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    project: videoProject( id: $id ) {
      id
      projectTitle
    }
  }
`;

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      id
      language {
        id
        displayName
      }
      files {
        id
      }
    }
  }
`;

export const EditSingleProjectItemContext = React.createContext();

const EditSingleProjectItem = ( {
  itemId, projectId, videoProjectQuery, videoUnitQuery
} ) => {
  const { project } = videoProjectQuery;
  const { loading, unit } = videoUnitQuery;

  const [selectedFile, setSelectedFile] = useState( () => {
    let initialFile = '';
    if ( !loading && unit ) {
      initialFile = unit && unit.files && unit.files[0]
        ? unit.files[0].id
        : '';
      return initialFile;
    }
    return initialFile;
  } );
  const [selectedProject, setSelectedProject] = useState( projectId );
  const [selectedUnit, setSelectedUnit] = useState( itemId );
  const [language, setLanguage] = useState( '' );

  const updateFile = id => (
    setSelectedFile( id )
  );

  const updateLanguage = lang => {
    setLanguage( lang );
  };

  const updateProject = id => (
    setSelectedProject( id )
  );

  const updateUnit = id => {
    setSelectedUnit( id );
  };

  if ( !project ) {
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
        <p>Loading the video...</p>
      </div>
    );
  }

  return (
    <EditSingleProjectItemContext.Provider
      value={ {
        language,
        selectedFile,
        selectedProject,
        selectedUnit,
        updateFile,
        updateLanguage,
        updateProject,
        updateUnit
      } }
    >
      <ModalItem
        customClassName="edit-project-item"
        headline={ `${project.projectTitle} ${language ? `in ${language}` : ''}` }
        textDirection="ltr"
      >
        <EditVideoModal />
      </ModalItem>
    </EditSingleProjectItemContext.Provider>
  );
};

EditSingleProjectItem.propTypes = {
  itemId: propTypes.string,
  projectId: propTypes.string,
  videoProjectQuery: propTypes.object,
  videoUnitQuery: propTypes.object
};

export default compose(
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'videoProjectQuery',
    options: props => ( {
      variables: { id: props.projectId },
    } )
  } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: props => ( {
      variables: { id: props.itemId },
    } )
  } )
)( EditSingleProjectItem );
