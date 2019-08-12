import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Confirm } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';

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
    hasSelectedAllDrafts,
    selections,
    showConfirmationMsg
  } = props;

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

        return (
          <Confirm
            className="delete"
            open={ deleteConfirmOpen }
            content={ (
              <ConfirmModalContent
                className="delete_confirm delete_confirm--video"
                headline="Are you sure you want to delete the selected video project(s)?"
              >
                { hasSelectedAllDrafts && <p>The selected DRAFT video project(s) will be removed permanently from the Content Cloud.</p> }

                { !hasSelectedAllDrafts
                  && (
                    <Fragment>
                      <p>Only selected DRAFT video project(s) will be permanently removed from the Content Cloud.</p>
                      <p>Selected Non-DRAFT projects will be not be removed.</p>
                    </Fragment>
                  ) }
              </ConfirmModalContent>
            ) }
            onCancel={ handleDeleteCancel }
            onConfirm={ () => handleDeleteConfirm( deleteProjects ) }
            cancelButton="No, take me back"
            confirmButton="Yes, delete forever"
          />
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
  hasSelectedAllDrafts: PropTypes.bool,
  selections: PropTypes.array,
  showConfirmationMsg: PropTypes.func
};

export default DeleteProjects;

export { DELETE_VIDEO_PROJECTS_MUTATION };
