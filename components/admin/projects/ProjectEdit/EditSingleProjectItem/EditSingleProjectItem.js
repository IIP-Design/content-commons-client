/**
 *
 * EditSingleProjectItem
 *
 */
import React, { useState } from 'react';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
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

export const EditSingleProjectItemContext = React.createContext();

const EditSingleProjectItem = ( { itemId, projectId, videoProjectQuery } ) => {
  const { project } = videoProjectQuery;

  const [selectedFile, setSelectedFile] = useState( '' );
  const [selectedProject, setSelectedProject] = useState( projectId );
  const [selectedUnit, setSelectedUnit] = useState( itemId );
  const [language, setLanguage] = useState( null );

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
    setLanguage( null );
    setSelectedFile( '' );
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
        headline={ `${project.projectTitle} ${language && language.displayName ? `in ${language.displayName}` : ''}` }
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
  videoProjectQuery: propTypes.object
};

export default graphql( VIDEO_PROJECT_QUERY, {
  name: 'videoProjectQuery',
  options: props => ( {
    variables: { id: props.projectId },
  } )
} )( EditSingleProjectItem );
