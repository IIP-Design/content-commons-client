/**
 *
 * EditSingleProjectItem
 *
 */
import React from 'react';
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

class EditSingleProjectItem extends React.PureComponent {
  render() {
    const { itemId, projectId } = this.props;
    const { project } = this.props.videoProjectQuery;
    const { unit } = this.props.videoUnitQuery;

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

    return (
      <ModalItem
        customClassName="edit-project-item"
        headline={ `${project.projectTitle} in ${unit.language.displayName}` }
        textDirection="ltr"
      >
        <EditVideoModal projectId={ projectId } unitId={ itemId } />
      </ModalItem>
    );
  }
}

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
