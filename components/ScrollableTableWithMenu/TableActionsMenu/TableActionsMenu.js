import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';
import {
  Button, Checkbox, Modal
} from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import { getCount } from 'lib/utils';
import DeleteIconButton from './DeleteIconButton/DeleteIconButton';
import DeleteProjects from './DeleteProjects/DeleteProjects';
import UnpublishProjects from './UnpublishProjects/UnpublishProjects';
import ActionResults from './ActionResults/ActionResults';
import { TEAM_VIDEO_PROJECTS_QUERY } from '../TableBody/TableBody';
import { TEAM_VIDEO_PROJECTS_COUNT_QUERY } from '../TablePagination/TablePagination';
import './TableActionsMenu.scss';

/* eslint-disable react/prefer-stateless-function */
class TableActionsMenu extends React.Component {
  state = {
    displayConfirmationMsg: false,
    deleteConfirmOpen: false,
    actionFailures: null,
  };

  _isMounted = false;

  CONFIRMATION_MSG_DELAY = 3000;

  componentDidMount = () => {
    this._isMounted = true;
  }

  componentDidUpdate = () => {
    const { actionFailures } = this.state;
    if ( this.state.displayConfirmationMsg && ( !actionFailures || !actionFailures.length ) ) {
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
            { id_in: this.getSelectedProjectsIds() },
            { status: 'PUBLISHED' }
          ]
        }
      }
    } );
  }

  handleActionResult = result => {
    if ( result.error ) {
      this.setState( ( { actionFailures } ) => ( { actionFailures: [...actionFailures, result] } ) );
    }
  }

  handleDeleteCancel = () => {
    this.setState( { deleteConfirmOpen: false } );
  }

  handleDeleteConfirm = () => {
    const {
      variables, teamVideoProjects, teamVideoProjectsCount
    } = this.props;
    teamVideoProjects.refetch( { ...variables } );
    teamVideoProjectsCount.refetch( {
      team: variables.team,
      searchTerm: variables.searchTerm
    } );
    this.showConfirmationMsg();
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
    const items = this.getSelectedProjectsIds();

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

  getSelectedProjectsIds = () => {
    const projectsArr = this.transformSelectedItemsMap();
    if ( projectsArr && projectsArr.length ) {
      return projectsArr.reduce( ( acc, curr ) => {
        if ( curr.value ) {
          return [...acc, curr.id];
        }
        return [...acc];
      }, [] );
    }
    return [];
  };

  getSelectedProjects = projects => {
    const projectIds = this.getSelectedProjectsIds();
    if ( projects && projects.length ) {
      const selections = projectIds.map( s => (
        projects.find( p => s === p.id )
      ) );
      return selections;
    }
    return [];
  }

  getProjectsOnPage = projects => {
    const { first, skip } = this.props.variables;
    return projects && projects.slice( skip, skip + first );
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

  // return true to suppress unpublish all feature for initial beta release
  hasSelectedAllDrafts = () => true;

  // hasSelectedAllDrafts = () => {
  //   // return true to suppress unpublish all feature for initial beta release
  //   return true;

  //   const draftProjects = this.getDraftProjects( this.props.teamVideoProjects.videoProjects || null );
  //   const selections = this.getSelectedProjectsIds();

  //   if ( selections.length > 0 ) {
  //     return selections.every(
  //       id => draftProjects.includes( id )
  //     );
  //   }
  //   return false;
  // }

  showConfirmationMsg = () => {
    this.setState( {
      displayConfirmationMsg: true,
    } );
  }

  hideConfirmationMsg = () => {
    if ( this._isMounted ) {
      this.setState( {
        displayConfirmationMsg: false,
        actionFailures: null
      } );
    }
    this.confirmationMsgTimer = null;
  }

  delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  }

  displayConfirmDelete = () => {
    this.setState( {
      deleteConfirmOpen: true,
      actionFailures: []
    } );
  }

  renderMenu() {
    const {
      teamVideoProjects, displayActionsMenu, toggleAllItemsSelection
    } = this.props;
    const { displayConfirmationMsg, actionFailures } = this.state;
    const { loading, error } = teamVideoProjects;

    if ( loading ) return 'Loading....';
    if ( error ) return <ApolloError error={ error } />;
    if ( !teamVideoProjects || !teamVideoProjects.videoProjects ) return null;

    const { videoProjects } = teamVideoProjects;

    const projectsOnPage = this.getProjectsOnPage( videoProjects );

    const projectsOnPageCount = getCount( projectsOnPage );

    const selections = this.getSelectedProjects( videoProjects );

    const selectionsCount = getCount( selections );

    const isDisabled = videoProjects && !videoProjects.length;

    const isChecked = ( projectsOnPageCount === selectionsCount )
      && selectionsCount > 0;

    const isIndeterminate = ( projectsOnPageCount > selectionsCount )
      && selectionsCount > 0;

    return (
      <Fragment>
        <Checkbox
          className={ displayActionsMenu ? 'actionsMenu_toggle actionsMenu_toggle--active' : 'actionsMenu_toggle' }
          onChange={ toggleAllItemsSelection }
          checked={ isChecked }
          disabled={ isDisabled }
          indeterminate={ isIndeterminate }
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
                <ActionResults failures={ actionFailures } />
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
            handleActionResult={ this.handleActionResult }
            handleResetSelections={ this.props.handleResetSelections }
            selections={ selections }
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
      </Fragment>
    );
  }

  render() {
    return (
      <div className="actionsMenu_wrapper">
        { this.renderMenu() }
      </div>
    );
  }
}

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  variables: PropTypes.object,
  selectedItems: PropTypes.object,
  teamVideoProjects: PropTypes.object,
  teamVideoProjectsCount: PropTypes.object,
  handleResetSelections: PropTypes.func,
  toggleAllItemsSelection: PropTypes.func
};

export default compose(
  graphql( TEAM_VIDEO_PROJECTS_QUERY, {
    name: 'teamVideoProjects',
    options: props => ( {
      variables: { ...props.variables },
      notifyOnNetworkStatusChange: true
    } )
  } ),
  graphql( TEAM_VIDEO_PROJECTS_COUNT_QUERY, {
    name: 'teamVideoProjectsCount',
    options: props => ( {
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    } )
  } ),
)( TableActionsMenu );
