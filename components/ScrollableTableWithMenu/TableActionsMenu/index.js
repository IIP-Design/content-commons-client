/**
 *
 * TableActionsMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import { Button, Checkbox, Confirm } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import deleteIcon from 'static/images/dashboard/delete.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import unpublishIcon from 'static/images/dashboard/unpublish.svg';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody';
import './TableActionsMenu.scss';

const DELETE_VIDEO_PROJECTS_MUTATION = gql`
  mutation DeleteManyVideoProjects($where: VideoProjectWhereInput) {
    deleteProjects: deleteManyVideoProjects(where: $where) {
      count
    }
  }
`;

const UNPUBLISH_VIDEO_PROJECTS_MUTATION = gql`
  mutation UnpublishManyVideoProjects(
    $data: VideoProjectUpdateManyMutationInput!,
    $where: VideoProjectWhereInput) {
    unpublish: updateManyVideoProjects(data: $data, where: $where) {
      count
    }
  }
`;

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  state = {
    deleteConfirmOpen: false
  };

  handleUnpublish = unpublishFn => {
    const { selectedItems } = this.props;
    unpublishFn( {
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: [...selectedItems.keys()] },
            { status_not: 'DRAFT' }
          ]
        }
      }
    } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleDeleteConfirm = deleteFn => {
    const { queryVariables, selectedItems } = this.props;
    deleteFn( {
      variables: {
        where: { id_in: [...selectedItems.keys()] }
      },
      refetchQueries: [{
        query: TEAM_VIDEO_PROJECTS_QUERY,
        variables: { ...queryVariables }
      }]
    } );
  }

  displayConfirmDelete = () => {
    this.setState( { deleteConfirmOpen: true } );
  }

  render() {
    const { displayActionsMenu, toggleAllItemsSelection } = this.props;

    return (
      <div className="actionsMenu_wrapper">
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
        />
        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>
          <Button size="mini" basic>
            <img src={ editIcon } alt="Edit Selection(s)" title="Edit Selection(s)" />
          </Button>

          <Button
            size="mini"
            basic
            onClick={ this.displayConfirmDelete }
          >
            <img src={ deleteIcon } alt="Delete Selection(s)" title="Delete Selection(s)" />
          </Button>

          <Mutation
            mutation={ DELETE_VIDEO_PROJECTS_MUTATION }
            onCompleted={ () => {
              this.props.handleResetSelections();
              this.handleDeleteCancel();
            } }
          >
            { ( deleteProjects, { error } ) => {
              if ( error ) return <ApolloError error={ error } />;

              return (
                <Confirm
                  className="delete"
                  open={ this.state.deleteConfirmOpen }
                  content={ (
                    <ConfirmModalContent
                      className="delete_confirm delete_confirm--video"
                      headline="Are you sure you want to delete the selected video project(s)?"
                    >
                      <p>The selected video project(s) will be permanently removed from the Content Cloud.</p>
                    </ConfirmModalContent>
                  ) }
                  onCancel={ this.handleDeleteCancel }
                  onConfirm={ () => this.handleDeleteConfirm( deleteProjects ) }
                  cancelButton="No, take me back"
                  confirmButton="Yes, delete forever"
                />
              );
            } }
          </Mutation>

          <Button size="mini" basic>
            <img src={ unpublishIcon } alt="Unpublish Selection(s)" title="Unpublish Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>

          <span className="separator">|</span>

          <Mutation
            mutation={ UNPUBLISH_VIDEO_PROJECTS_MUTATION }
            onCompleted={ () => this.props.handleResetSelections() }
          >
            { ( unpublish, { error } ) => {
              if ( error ) return <ApolloError error={ error } />;
              return (
                <Button
                  className="unpublish"
                  size="mini"
                  basic
                  onClick={
                    () => this.handleUnpublish( unpublish )
                  }
                >
                  <span className="unpublish--text">Unpublish</span>
                </Button>
              );
            } }
          </Mutation>
        </div>
      </div>
    );
  }
}

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  queryVariables: PropTypes.object,
  selectedItems: PropTypes.object,
  handleResetSelections: PropTypes.func,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
