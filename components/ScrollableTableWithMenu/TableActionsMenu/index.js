/**
 *
 * TableActionsMenu
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import { Mutation } from 'react-apollo';
import gql from 'graphql-tag';
import {
  Button, Checkbox, Confirm, Icon, Modal, Popup
} from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import deleteIcon from 'static/images/dashboard/delete.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
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
    displayConfirmationMsg: false,
    deleteConfirmOpen: false
  };

  _isMounted = false;

  CONFIRMATION_MSG_DELAY = 3000;

  componentDidMount = () => {
    this._isMounted = true;
  }

  componentDidUpdate = () => {
    if ( this.state.displayConfirmationMsg ) {
      this.delayUnmount( this.hideConfirmationMsg, this.confirmationMsgTimer, this.CONFIRMATION_MSG_DELAY );
    }
  }

  componentWillUnmount = () => {
    this._isMounted = false;
    clearTimeout( this.confirmationMsgTimer );
  }

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
    const { variables, selectedItems } = this.props;
    deleteFn( {
      variables: {
        where: { id_in: [...selectedItems.keys()] }
      },
      refetchQueries: [{
        query: TEAM_VIDEO_PROJECTS_QUERY,
        variables: { ...variables }
      }]
    } );
  }

  handleUnpublishCacheUpdate = cache => {
    const { variables, selectedItems } = this.props;
    const items = [...selectedItems.keys()];
    const data = cache.readQuery( {
      query: TEAM_VIDEO_PROJECTS_QUERY,
      variables: { ...variables }
    } );

    // set status & visibility
    this.setStatusVisibility( items, data.videoProjects );

    // write transformed data to cache to match server
    cache.writeQuery( { query: TEAM_VIDEO_PROJECTS_QUERY, data } );
  }

  setStatusVisibility = ( items, projects ) => {
    items.forEach( item => {
      const selections = projects.filter( project => project.id === item );
      selections.forEach( project => {
        project.status = 'DRAFT';
        project.visibility = 'INTERNAL';
      } );
    } );
  }

  showConfirmationMsg = () => {
    this.setState( { displayConfirmationMsg: true } );
  }

  hideConfirmationMsg = () => {
    if ( this._isMounted ) {
      this.setState( { displayConfirmationMsg: false } );
    }
    this.confirmationMsgTimer = null;
  }

  delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  }

  displayConfirmDelete = () => {
    this.setState( { deleteConfirmOpen: true } );
  }

  render() {
    const { displayActionsMenu, toggleAllItemsSelection } = this.props;
    const { displayConfirmationMsg } = this.state;

    return (
      <div className="actionsMenu_wrapper">
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
        />
        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>

          <Modal
            className="confirmation"
            closeIcon
            onClose={ this.hideConfirmationMsg }
            open={ displayConfirmationMsg }
            size="tiny"
          >
            <Modal.Content>
              <Modal.Description>
                <Icon color="green" name="check circle outline" size="big" />
                <span
                  className="msg"
                  style={ { verticalAlign: 'middle', fontSize: '1rem' } }
                >
                  You&rsquo;ve updated your projects successfully.
                </span>
              </Modal.Description>
            </Modal.Content>
          </Modal>

          <Button size="mini" basic disabled>
            <img src={ editIcon } alt="Edit Selection(s)" title="Edit Selection(s)" />
          </Button>

          <Popup
            trigger={ (
              <Button
                size="mini"
                basic
                onClick={ this.displayConfirmDelete }
              >
                <img src={ deleteIcon } alt="Delete Selection(s)" />
              </Button>
            ) }
            content="Delete Selection(s)"
            hideOnScroll
            inverted
            on={ ['hover', 'focus'] }
            size="mini"
          />

          <Mutation
            mutation={ DELETE_VIDEO_PROJECTS_MUTATION }
            onCompleted={ () => {
              this.props.handleResetSelections();
              this.handleDeleteCancel();
              this.showConfirmationMsg();
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

          <Button size="mini" basic disabled>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic disabled>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>

          <span className="separator">|</span>

          <Mutation
            mutation={ UNPUBLISH_VIDEO_PROJECTS_MUTATION }
            update={ this.handleUnpublishCacheUpdate }
            onCompleted={ () => {
              this.props.handleResetSelections();
              this.showConfirmationMsg();
            } }
          >
            { ( unpublish, { error } ) => {
              if ( error ) return <ApolloError error={ error } />;
              return (
                <Popup
                  trigger={ (
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
                  ) }
                  content="Unpublish Selection(s)"
                  hideOnScroll
                  inverted
                  on={ ['hover', 'focus'] }
                  size="mini"
                />
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
  variables: PropTypes.object,
  selectedItems: PropTypes.object,
  handleResetSelections: PropTypes.func,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
