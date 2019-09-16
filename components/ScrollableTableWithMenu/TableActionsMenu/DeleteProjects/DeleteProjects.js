import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Modal } from 'semantic-ui-react';
import { getApolloErrors, getCount, getPluralStringOrNot } from 'lib/utils';
import { DELETE_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import DeleteProjectsList from './DeleteProjectsList/DeleteProjectsList';

const DELETE_VIDEO_PROJECTS_MUTATION = gql`
  mutation DeleteManyVideoProjects($where: VideoProjectWhereInput) {
    deleteProjects: deleteManyVideoProjects(where: $where) {
      count
    }
  }
`;

const DeleteProjects = props => {
  const {
    deleteConfirmOpen,
    handleDeleteCancel,
    handleDeleteConfirm,
    selections,
    deleteVideoProject
  } = props;

  const getDrafts = () => {
    if ( selections && selections.length ) {
      return selections.filter( selection => selection.status === 'DRAFT' );
    }
    return [];
  };

  const getNonDrafts = () => {
    if ( selections && selections.length ) {
      return selections.filter( selection => selection.status !== 'DRAFT' );
    }
    return [];
  };


  const drafts = getDrafts();
  const draftsCount = getCount( drafts );

  const nonDrafts = getNonDrafts();
  const nonDraftsCount = getCount( nonDrafts );

  const hasNonDraftsOnly = draftsCount === 0 && nonDraftsCount > 0;

  const deleteProjects = () => {
    const promises = drafts.map( project => deleteVideoProject( { variables: { id: project.id } } )
      .catch( error => ( {
        error,
        errors: getApolloErrors( error ),
        action: 'delete',
        id: project.id,
        projectTitle: project.projectTitle,
      } ) ) );
    return Promise.all( promises ).then( results => {
      handleDeleteCancel();
      return results;
    } );
  };

  return (
    <Modal className="delete" open={ deleteConfirmOpen } size="small">
      <ConfirmModalContent
        className="delete_confirm delete_confirm--video"
        headline={
          hasNonDraftsOnly
            ? 'Only DRAFT video projects can be deleted from the dashboard.'
            : `Are you sure you want to delete the selected DRAFT video ${getPluralStringOrNot( drafts, 'project' )}?` // eslint-disable-line
        }
      >
        { draftsCount > 0
        && (
          <DeleteProjectsList
            headline={ `The following DRAFT video ${getPluralStringOrNot( drafts, 'project' )} will be removed permanently from the Content Cloud:` }
            projects={ drafts }
            isDrafts
          />
        ) }

        { nonDraftsCount > 0
        && (
          <DeleteProjectsList
            headline={ `${draftsCount > 0 && nonDraftsCount > 0 ? 'Only DRAFT video projects can be deleted from the dashboard. ' : ''}The following non-DRAFT video ${getPluralStringOrNot( nonDrafts, 'project' )} will NOT be removed:` }
            projects={ nonDrafts }
          />
        ) }
      </ConfirmModalContent>
      <Modal.Actions>
        <Button
          content={
            hasNonDraftsOnly
              ? 'Take me back'
              : 'No, take me back'
          }
          onClick={ handleDeleteCancel }
        />
        <Button
          content={
            hasNonDraftsOnly
              ? 'Not Applicable'
              : 'Yes, delete forever'
          }
          disabled={ hasNonDraftsOnly }
          onClick={ () => handleDeleteConfirm( deleteProjects ) }
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

DeleteProjects.propTypes = {
  deleteConfirmOpen: PropTypes.bool,
  handleDeleteCancel: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  selections: PropTypes.array,
  deleteVideoProject: PropTypes.func
};

export default graphql( DELETE_VIDEO_PROJECT_MUTATION, {
  name: 'deleteVideoProject'
} )( DeleteProjects );

export { DELETE_VIDEO_PROJECTS_MUTATION };
