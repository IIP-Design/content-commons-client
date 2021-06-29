import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Button, Modal } from 'semantic-ui-react';

import { getPluralStringOrNot } from 'lib/utils';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import DeleteProjectsList from './DeleteProjectsList/DeleteProjectsList';
import { DashboardContext } from 'context/dashboardContext';


const DeleteProjects = ( {
  deleteConfirmOpen,
  handleActionResult,
  handleDeleteCancel,
  handleDeleteConfirm,
  handleResetSelections,
  selections,
} ) => {
  const { state } = useContext( DashboardContext );

  const [deleteDashboardProject, { loading, error }] = useMutation( state.queries.remove );

  // Set project type text for confirmation modal display
  const displayProjectTypeText = () => {
    const types = state?.team?.contentTypes ? state.team.contentTypes : [];

    if ( types.includes( 'GRAPHIC' ) ) return 'graphic';
    if ( types.includes( 'VIDEO' ) ) return 'video';
    if ( types.includes( 'PACKAGE' ) ) return 'package';
    if ( types.includes( 'PLAYBOOK' ) ) return 'playbook';

    return '';
  };

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

  const hasDrafts = getDrafts().length > 0;
  const hasNonDrafts = getNonDrafts().length > 0;
  const hasNonDraftsOnly = !hasDrafts && hasNonDrafts;
  const hasBoth = hasDrafts && hasNonDrafts;

  const deleteProject = async project => {
    const result = await deleteDashboardProject( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'delete',
    } ) );

    handleActionResult( result );
  };

  const handleDeleteProjects = async () => {
    await Promise.all( getDrafts().map( deleteProject ) );
    handleResetSelections();
    handleDeleteConfirm();
    handleDeleteCancel();
  };

  if ( !deleteDashboardProject ) return null;

  /**
   * Dynamically composes a message string and list of items based on whether the items are drafts or not
   * If passed the string 'draft' will provide the message fragment for draft content, otherwise will return that for non drafts
   *
   * @param {string} isDraft
   * @returns {string} dynamic message fragment
   */
  const messageFragment = isDraft => {
    const getFunc = isDraft === 'draft' ? getDrafts() : getNonDrafts();

    const type = displayProjectTypeText();

    if ( type === 'graphic' || type === 'video' ) {
      return `${type} ${getPluralStringOrNot( getFunc, 'project' )}`;
    }

    return getPluralStringOrNot( getFunc, type );
  };

  return (
    <Modal className="delete" open={ deleteConfirmOpen } size="small">
      <ConfirmModalContent
        className="delete_confirm delete_confirm--video"
        headline={
          hasNonDraftsOnly
            ? `Only DRAFT ${displayProjectTypeText()} projects can be deleted from the dashboard.`
            : `Are you sure you want to delete the selected DRAFT ${messageFragment( 'draft' )}?`
        }
      >
        { hasDrafts && (
          <DeleteProjectsList
            headline={ `The following DRAFT ${messageFragment( 'draft' )} will be removed permanently from Content Commons:` }
            projects={ getDrafts() }
            isDrafts
          />
        ) }

        { hasNonDrafts && (
          <DeleteProjectsList
            headline={
              `${hasBoth ? `Only DRAFT ${displayProjectTypeText()} projects can be deleted from the dashboard. ` : ''}
              The following non-DRAFT ${messageFragment()} will NOT be removed:`
            }
            projects={ getNonDrafts() }
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
  deleteConfirmOpen: PropTypes.bool,
  handleActionResult: PropTypes.func,
  handleDeleteCancel: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleResetSelections: PropTypes.func,
  selections: PropTypes.array,
};

export default DeleteProjects;
