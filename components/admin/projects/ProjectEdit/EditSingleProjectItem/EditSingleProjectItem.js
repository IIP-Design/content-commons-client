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
    }
  }
`;

export const EditSingleProjectItemContext = React.createContext();

const EditSingleProjectItem = ( {
  itemId, projectId, videoProjectQuery, videoUnitQuery
} ) => {
  const { project } = videoProjectQuery;
  const { unit } = videoUnitQuery;

  const [selectedProject, setSelectedProject] = useState( projectId );
  const [selectedUnit, setSelectedUnit] = useState( itemId );
  const [language, setLanguage] = useState( '' );

  const updateProject = id => (
    setSelectedProject( id )
  );

  const updateUnit = async id => {
    setSelectedUnit( id );
  };

  if ( !unit || !project ) {
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

  const lang = unit.language && unit.language.displayName ? unit.language.displayName : '';

  return (
    <EditSingleProjectItemContext.Provider
      value={ {
        language,
        selectedProject,
        selectedUnit,
        updateProject,
        updateUnit
      } }
    >
      <ModalItem
        customClassName="edit-project-item"
        headline={ `${project.projectTitle} ${language ? `in ${language}` : ''}` }
        textDirection="ltr"
      >
        <EditVideoModal projectId={ selectedProject } unitId={ selectedUnit } />
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
