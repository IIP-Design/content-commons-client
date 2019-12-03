/* eslint-disable react/destructuring-assignment */
import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Button, Checkbox, Modal } from 'semantic-ui-react';
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
// TEMP
import { packageMocks, documentFileMocks } from '../TableBody/pressMocks';

const CONFIRMATION_MSG_DELAY = 3000;

const getDraftProjects = projects => {
  if ( !projects ) return [];
  return projects.reduce( ( acc, curr ) => {
    if ( curr.status === 'DRAFT' ) {
      return [...acc, curr.id];
    }
    return [...acc];
  }, [] );
};

const delayUnmount = ( fn, timer, delay ) => {
  if ( timer ) clearTimeout( timer );
  /* eslint-disable no-param-reassign */
  timer = setTimeout( fn, delay );
};


const TableActionsMenu = props => {
  const {
    loading,
    error,
    data: teamVideoProjects,
    refetch: videoProjectsRefetch
  } = useQuery( TEAM_VIDEO_PROJECTS_QUERY, {
    variables: { ...props.variables },
    notifyOnNetworkStatusChange: true
  } );

  const {
    loading: projectCountLoading,
    error: projectCountError,
    data: teamVideoProjectsCount,
    refetch: videoProjectsCountRefetch
  } = useQuery(
    TEAM_VIDEO_PROJECTS_COUNT_QUERY, {
      variables: {
        team: props.variables.team,
        searchTerm: props.variables.searchTerm
      }
    }
  );

  const [displayConfirmationMsg, setDisplayConfirmationMsg] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [actionFailures, setActionFailures] = useState( [] );
  const [confirmationMsgTimer, setConfirmationMsgTimer] = useState( null );

  const [isMounted, setIsMounted] = useState( false );
  useEffect( () => {
    setIsMounted( true );
    return () => setIsMounted( false );
  }, [isMounted] );

  useEffect( () => {
    if ( displayConfirmationMsg && !actionFailures.length ) {
      delayUnmount(
        /* eslint-disable no-use-before-define */
        hideConfirmationMsg,
        confirmationMsgTimer,
        CONFIRMATION_MSG_DELAY
      );
    }
  } );

  const showConfirmationMsg = () => {
    setDisplayConfirmationMsg( true );
  };

  const hideConfirmationMsg = () => {
    if ( isMounted ) {
      setDisplayConfirmationMsg( false );
      setActionFailures( [] );
    }
    setConfirmationMsgTimer( null );
  };

  const handleActionResult = result => {
    if ( result.error ) {
      setActionFailures( prevState => [...prevState, result] );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen( false );
  };

  const handleActionCompleted = () => {
    const { variables } = props;
    videoProjectsRefetch( { ...variables } );
    videoProjectsCountRefetch( {
      team: variables.team,
      searchTerm: variables.searchTerm
    } );
    showConfirmationMsg();
  };

  const transformSelectedItemsMap = () => {
    const { selectedItems } = props;
    if ( selectedItems.size === 0 ) return [];
    const arr = [];
    selectedItems.forEach( ( value, key ) => arr.push( { id: key, value } ) );
    return arr;
  };

  const getSelectedProjectsIds = () => {
    const projectsArr = transformSelectedItemsMap();
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

  const getSelectedProjects = projects => {
    const projectIds = getSelectedProjectsIds();
    if ( projects && projects.length ) {
      const selections = projectIds.map( s => projects.find( p => s === p.id ) );
      return selections;
    }
    return [];
  };

  const hasSelectedAllDrafts = () => {
    // const draftProjects = this.getDraftProjects( this.props.teamVideoProjects.videoProjects || null );
    const teamPackages = packageMocks[0].result.data;
    const teamDocumentFiles = documentFileMocks[0].result.data;
    const { videoProjects } = teamVideoProjects;
    const projectsWithPackages = [...teamPackages, ...teamDocumentFiles, ...videoProjects];
    const draftProjects = getDraftProjects( projectsWithPackages || null );

    const selections = getSelectedProjectsIds();

    if ( selections.length > 0 ) {
      return selections.every( id => draftProjects.includes( id ) );
    }
    return false;
  };

  const displayConfirmDelete = () => {
    setDeleteConfirmOpen( true );
    setActionFailures( [] );
  };

  const getProjectsOnPage = projects => {
    const { first, skip } = props.variables;
    return projects && projects.slice( skip, skip + first );
  };

  const {
    displayActionsMenu,
    toggleAllItemsSelection,
    handleResetSelections
  } = props;

  const renderMenu = () => {
    if ( loading ) return 'Loading....';
    if ( error ) return <ApolloError error={ error } />;
    if ( !teamVideoProjects || !teamVideoProjects.videoProjects ) return null;

    const { videoProjects } = teamVideoProjects;
    // TEMP
    const teamPackages = packageMocks[0].result.data;
    const teamDocumentFiles = documentFileMocks[0].result.data;
    const allProjectTypes = [...teamPackages, ...teamDocumentFiles, ...videoProjects];

    // const projectsOnPage = this.getProjectsOnPage( videoProjects );
    const projectsOnPage = getProjectsOnPage( allProjectTypes );

    const projectsOnPageCount = getCount( projectsOnPage );

    // const selections = this.getSelectedProjects( videoProjects );
    const selections = getSelectedProjects( allProjectTypes );

    const selectionsCount = getCount( selections );

    // const isDisabled = videoProjects && !videoProjects.length;
    const isDisabled = allProjectTypes && !allProjectTypes.length;

    const isChecked = projectsOnPageCount === selectionsCount && selectionsCount > 0;

    const isIndeterminate = projectsOnPageCount > selectionsCount && selectionsCount > 0;

    return (
      <Fragment>
        <Checkbox
          className={
            displayActionsMenu
              ? 'actionsMenu_toggle actionsMenu_toggle--active'
              : 'actionsMenu_toggle'
          }
          onChange={ toggleAllItemsSelection }
          checked={ isChecked }
          disabled={ isDisabled }
          indeterminate={ isIndeterminate }
        />

        <div className={ displayActionsMenu ? 'actionsMenu active' : 'actionsMenu' }>
          <Modal
            className="confirmation"
            closeIcon
            onClose={ hideConfirmationMsg }
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

          <DeleteIconButton displayConfirmDelete={ displayConfirmDelete } />

          <DeleteProjects
            deleteConfirmOpen={ deleteConfirmOpen }
            handleDeleteCancel={ handleDeleteCancel }
            handleDeleteConfirm={ handleActionCompleted }
            handleActionResult={ handleActionResult }
            handleResetSelections={ handleResetSelections }
            selections={ selections }
            showConfirmationMsg={ showConfirmationMsg }
          />

          <Button size="mini" basic disabled>
            <img src={ createIcon } alt="Create Selection(s)" title="Create Selection(s)" />
          </Button>
          <Button size="mini" basic disabled>
            <img src={ archiveIcon } alt="Archive Selection(s)" title="Archive Selection(s)" />
          </Button>

          { !hasSelectedAllDrafts() && (
            <>
              <span className="separator">|</span>
              <UnpublishProjects
                handleResetSelections={ handleResetSelections }
                handleActionResult={ handleActionResult }
                showConfirmationMsg={ showConfirmationMsg }
                selections={ selections }
              />
            </>
          ) }
        </div>
      </Fragment>
    );
  };

  return <div className="actionsMenu_wrapper">{ renderMenu() }</div>;
};

TableActionsMenu.propTypes = {
  displayActionsMenu: PropTypes.bool,
  variables: PropTypes.object,
  selectedItems: PropTypes.object,
  handleResetSelections: PropTypes.func,
  toggleAllItemsSelection: PropTypes.func
};

export default TableActionsMenu;
