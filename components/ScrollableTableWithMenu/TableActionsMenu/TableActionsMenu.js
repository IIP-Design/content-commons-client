import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import {
  Button, Checkbox, Icon, Modal
} from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import DeleteIconButton from './DeleteIconButton/DeleteIconButton';
import DeleteProjects from './DeleteProjects/DeleteProjects';
import UnpublishProjects from './UnpublishProjects/UnpublishProjects';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import './TableActionsMenu.scss';

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  state = {
    displayConfirmationMsg: false,
    deleteConfirmOpen: false,
    draftProjects: []
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
    unpublishFn( {
      variables: {
        data: { status: 'DRAFT', visibility: 'INTERNAL' },
        where: {
          AND: [
            { id_in: this.getSelectedProjects() },
            { status: 'PUBLISHED' }
          ]
        }
      }
    } );
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleDeleteConfirm = deleteFn => {
    const { variables } = this.props;
    deleteFn( {
      variables: {
        where: { id_in: this.getSelectedProjects() }
      },
      refetchQueries: [{
        query: TEAM_VIDEO_PROJECTS_QUERY,
        variables: { ...variables }
      },
      {
        query: TEAM_VIDEO_PROJECTS_COUNT_QUERY,
        variables: {
          team: variables.team,
          searchTerm: variables.searchTerm
        }
      }]
    } );
  }

  handleDrafts = cache => {
    if ( cache ) {
      const drafts = this.getDraftProjects( cache.videoProjects );
      this.setState( prevState => {
        if ( prevState.draftProjects !== drafts ) {
          return { draftProjects: drafts };
        }
      } );
    }
  }

  handleUnpublishCacheUpdate = cache => {
    const { variables } = this.props;
    const items = this.getSelectedProjects();

    try {
      const data = this.getCachedQuery(
        cache, TEAM_VIDEO_PROJECTS_QUERY, variables
      );

      // set status
      this.handleStatus( items, data.videoProjects );

      // write transformed data to cache to match server
      cache.writeQuery( { query: TEAM_VIDEO_PROJECTS_QUERY, data } );

      // keep track of draft projects
      this.handleDrafts( data );
    } catch ( error ) {
      console.error( error );
    }
  }

  handleStatus = ( items, projects ) => {
    items.forEach( item => {
      const selections = projects.filter( project => project.id === item );
      selections.forEach( project => {
        project.status = 'DRAFT';
      } );
    } );
  }

  getCachedQuery = ( cache, query, variables ) => (
    cache.readQuery( {
      query,
      variables: { ...variables }
    } )
  )

  getDraftProjects = projects => {
    if ( !projects ) return [];
    return projects.reduce( ( acc, curr ) => {
      if ( curr.status === 'DRAFT' ) {
        return [...acc, curr.id];
      }
      return [...acc];
    }, [] );
  }

  getSelectedProjects = () => {
    const projects = this.transformSelectedItemsMap();
    return projects.reduce( ( acc, curr ) => {
      if ( curr.value ) {
        return [...acc, curr.id];
      }
      return [...acc];
    }, [] );
  }

  transformSelectedItemsMap = () => {
    const { selectedItems } = this.props;
    if ( selectedItems.size === 0 ) return [];
    const arr = [];
    selectedItems.forEach(
      ( value, key ) => arr.push( { id: key, value } )
    );
    return arr;
  }

  hasSelectedAllDrafts = () => {
    const { draftProjects } = this.state;
    const selections = this.getSelectedProjects();

    if ( selections.length > 0 ) {
      return selections.every(
        project => draftProjects.includes( project )
      );
    }
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
    const {
      displayActionsMenu, toggleAllItemsSelection, variables
    } = this.props;
    const { displayConfirmationMsg } = this.state;

    return (
      <div className="actionsMenu_wrapper">
        <Query
          query={ TEAM_VIDEO_PROJECTS_QUERY }
          variables={ { ...variables } }
          onCompleted={ this.handleDrafts }
          /**
           * `onCompleted doesn't get called for Query,
           * so set `notifyOnNetworkStatusChange` to
           * allow it to be called.
           * @see open issue:
           * https://github.com/apollographql/react-apollo/issues/2293#issuecomment-428938827
           */
          notifyOnNetworkStatusChange
        >
          { ( { loading, error, data } ) => {
            if ( loading ) return 'Loading....';
            if ( error ) return <ApolloError error={ error } />;
            if ( !data || !data.videoProjects ) return null;

            const { videoProjects } = data;

            const isDisabled = videoProjects && !videoProjects.length;

            const isChecked = ( videoProjects
              && videoProjects.length === this.getSelectedProjects().length )
              && this.getSelectedProjects().length > 0;

            const isIndeterminate = ( videoProjects
              && videoProjects.length > this.getSelectedProjects().length )
              && this.getSelectedProjects().length > 0;

            return (
              <Checkbox
                className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
                onChange={ toggleAllItemsSelection }
                checked={ isChecked }
                disabled={ isDisabled }
                indeterminate={ isIndeterminate }
              />
            );
          } }
        </Query>

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

          <DeleteIconButton
            displayConfirmDelete={ this.displayConfirmDelete }
          />

          <DeleteProjects
            deleteConfirmOpen={ this.state.deleteConfirmOpen }
            handleDeleteCancel={ this.handleDeleteCancel }
            handleDeleteConfirm={ this.handleDeleteConfirm }
            handleResetSelections={ this.props.handleResetSelections }
            showConfirmationMsg={ this.showConfirmationMsg }
          />

          <Button size="mini" basic disabled>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic disabled>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>

          { !this.hasSelectedAllDrafts()
            && (
            <Fragment>
              <span className="separator">|</span>
              <UnpublishProjects
                handleResetSelections={
                  this.props.handleResetSelections
                }
                handleUnpublish={ this.handleUnpublish }
                handleUnpublishCacheUpdate={
                  this.handleUnpublishCacheUpdate
                }
                showConfirmationMsg={ this.showConfirmationMsg }
              />
            </Fragment>
            ) }
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
