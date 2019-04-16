/**
 *
 * EditSingleProjectItem
 *
 */
import React from 'react';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import { object } from 'prop-types';

import { Loader } from 'semantic-ui-react';

import ModalItem from 'components/modals/ModalItem/ModalItem';
import VideoEditVideo from 'components/admin/projects/ProjectEdit/VideoEditVideo/VideoEditVideo';
import './EditSingleProjectItem.scss';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    project: videoProject( id: $id ) {
      projectTitle
    }
  }
`;

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    unit: videoUnit( id: $id ) {
      language {
        displayName
      }
    }
  }
`;

class EditSingleProjectItem extends React.PureComponent {
  render() {
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
        <VideoEditVideo id="cju34f1iv003908755bm55l35" />
      </ModalItem>
    );
  }
}

EditSingleProjectItem.propTypes = {
  videoProjectQuery: object,
  videoUnitQuery: object
};

export default compose(
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'videoProjectQuery',
    options: {
      variables: { id: 'cjtg3ecxk003c0775o7uxt3mj' }
    }
  } ),
  graphql( VIDEO_UNIT_QUERY, {
    name: 'videoUnitQuery',
    options: {
      variables: { id: 'cju34f1iv003908755bm55l35' }
    }
  } )
)( EditSingleProjectItem );
