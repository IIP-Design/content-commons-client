import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Modal } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import { getCount, getPluralStringOrNot } from 'lib/utils';
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
    handleResetSelections,
    selections,
    showConfirmationMsg
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

  return (
    <Mutation
      mutation={ DELETE_VIDEO_PROJECTS_MUTATION }
      onCompleted={ () => {
        handleResetSelections();
        handleDeleteCancel();
        showConfirmationMsg();
      } }
    >
      { ( deleteProjects, { error } ) => {
        if ( error ) return <ApolloError error={ error } />;

        const drafts = getDrafts();
        const draftsCount = getCount( drafts );

        const nonDrafts = getNonDrafts();
        const nonDraftsCount = getCount( nonDrafts );

        const hasNonDraftsOnly = draftsCount === 0 && nonDraftsCount > 0;

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
                    headline={ `The following non-DRAFT video ${getPluralStringOrNot( nonDrafts, 'project' )} will <strong>not</strong> be removed:` }
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
                outline
                primary
              />
            </Modal.Actions>
          </Modal>
        );
      } }
    </Mutation>
  );
};

DeleteProjects.propTypes = {
  deleteConfirmOpen: PropTypes.bool,
  handleDeleteCancel: PropTypes.func,
  handleDeleteConfirm: PropTypes.func,
  handleResetSelections: PropTypes.func,
  selections: PropTypes.array,
  showConfirmationMsg: PropTypes.func
};

export default DeleteProjects;

export { DELETE_VIDEO_PROJECTS_MUTATION };
