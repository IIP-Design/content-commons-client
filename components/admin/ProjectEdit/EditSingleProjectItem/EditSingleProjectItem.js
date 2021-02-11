/**
 *
 * EditSingleProjectItem
 *
 */
import React, { useState } from 'react';
import dynamic from 'next/dynamic';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import propTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';

import useTimeout from 'lib/hooks/useTimeout';

import './EditSingleProjectItem.scss';

const EditVideoModal = dynamic( () => import( /* webpackChunkName: "editVideoModal" */ 'components/admin/ProjectEdit/EditVideoModal/EditVideoModal' ) ); // eslint-disable-line import/no-cycle
const ModalItem = dynamic( () => import( /* webpackChunkName: "modalItem" */ 'components/modals/ModalItem/ModalItem' ) );

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY($id: ID!) {
    project: videoProject(id: $id) {
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
  const [showNotication, setShowNotification] = useState( false );

  const updateSelectedUnit = ( unit, file ) => {
    setLanguage( null );
    setSelectedFile( file || '' );
    setSelectedUnit( unit );
  };

  const hideNotification = () => {
    setShowNotification( false );
  };

  const { startTimeout } = useTimeout( hideNotification, 300 );

  if ( !project ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          height: '100vh',
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
        setLanguage,
        setSelectedFile,
        setSelectedUnit,
        setSelectedProject,
        setShowNotification,
        showNotication,
        startTimeout,
        updateSelectedUnit,
      } }
    >
      <ModalItem
        customClassName="edit-project-item"
        headline={ project.projectTitle }
        subHeadline={ language && language.displayName ? ` | ${language.displayName}` : '' }
        textDirection="ltr"
      >
        <EditVideoModal unitId={ selectedUnit } />
      </ModalItem>
    </EditSingleProjectItemContext.Provider>
  );
};

EditSingleProjectItem.propTypes = {
  itemId: propTypes.string,
  projectId: propTypes.string,
  videoProjectQuery: propTypes.object,
};

export default graphql( VIDEO_PROJECT_QUERY, {
  name: 'videoProjectQuery',
  options: props => ( {
    variables: { id: props.projectId },
  } ),
} )( EditSingleProjectItem );
