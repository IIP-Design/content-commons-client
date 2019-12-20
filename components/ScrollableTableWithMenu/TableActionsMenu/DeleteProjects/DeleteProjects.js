import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Button, Modal } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import { setProjectsQueries } from 'lib/graphql/util';
import { DELETE_VIDEO_PROJECT_MUTATION } from 'lib/graphql/queries/video';
import { DELETE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import DeleteProjectsList from './DeleteProjectsList/DeleteProjectsList';

const DeleteProjects = props => {
  const {
    team,
    deleteConfirmOpen,
    handleActionResult,
    handleDeleteCancel,
    handleDeleteConfirm,
    handleResetSelections,
    selections,
  } = props;

  // Determine which Query to run
  const graphQuery = setProjectsQueries( team, {
    videoProjects: DELETE_VIDEO_PROJECT_MUTATION,
    packages: DELETE_PACKAGE_MUTATION
  } );

  const [deleteDashboardProject, { loading, error }] = useMutation( graphQuery );

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

  const deleteProject = async project => {
    const result = await deleteDashboardProject( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'delete',
    } ) );
    handleActionResult( result );
  };

  const handleDeleteProjects = async () => {
    await Promise.all( drafts.map( deleteProject ) );
    handleResetSelections();
    handleDeleteConfirm();
    handleDeleteCancel();
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
          onClick={ handleDeleteProjects }
          primary
        />
      </Modal.Actions>
    </Modal>
  );
};

DeleteProjects.propTypes = {
  team: PropTypes.object,
  deleteConfirmOpen: PropTypes.bool,
  handleActionResult: PropTypes.func,
  handleDeleteCancel: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleResetSelections: PropTypes.func,
  selections: PropTypes.array,
};

export default DeleteProjects;
