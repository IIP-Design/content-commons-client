import React, { Fragment, useContext, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Checkbox, Modal } from 'semantic-ui-react';

import ApolloError from 'components/errors/ApolloError';
import editIcon from 'static/images/dashboard/edit.svg';
import createIcon from 'static/images/dashboard/create.svg';
import archiveIcon from 'static/images/dashboard/archive.svg';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';
import DeleteIconButton from './DeleteIconButton/DeleteIconButton';
import DeleteProjects from './DeleteProjects/DeleteProjects';
import UnpublishProjects from './UnpublishProjects/UnpublishProjects';
import ActionResults from './ActionResults/ActionResults';
import { DashboardContext } from 'context/dashboardContext';

import './TableActionsMenu.scss';

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

const TableActionsMenu = ( {
  data,
  error,
  handleResetSelections,
  loading,
  refetch,
  refetchCount,
  toggleAllItemsSelection,
  variables,
} ) => {
  const { state } = useContext( DashboardContext );

  const selectedItems = state?.selected?.selectedItems || new Map();
  const displayActionsMenu = state?.selected?.displayActionsMenu || false;
  const team = state?.team || { contentTypes: null };

  const [displayConfirmationMsg, setDisplayConfirmationMsg] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [actionFailures, setActionFailures] = useState( [] );

  const [isMounted, setIsMounted] = useState( false );

  useEffect( () => {
    setIsMounted( true );

    return () => setIsMounted( false );
  }, [isMounted] );

  const showConfirmationMsg = () => {
    setDisplayConfirmationMsg( true );
  };

  const hideConfirmationMsg = () => {
    if ( isMounted ) {
      setDisplayConfirmationMsg( false );
      setActionFailures( [] );
    }
  };

  const { startTimeout } = useTimeout( hideConfirmationMsg, CONFIRMATION_MSG_DELAY );

  useEffect( () => {
    if ( displayConfirmationMsg && !actionFailures.length ) {
      startTimeout();
    }
  } );

  if ( loading && !data ) return 'Loading....';
  if ( error ) return <ApolloError error={ error } />;

  const handleActionResult = result => {
    if ( result.error ) {
      setActionFailures( prevState => [...prevState, result] );
    }
  };

  const handleDeleteCancel = () => {
    setDeleteConfirmOpen( false );
  };

  const handleActionCompleted = () => {
    refetch( { ...variables } );
    refetchCount( {
      team: variables.team,
      searchTerm: variables.searchTerm,
    } );
    showConfirmationMsg();
  };

  const transformSelectedItemsMap = () => {
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
      const selections = [];

      projectIds.map( s => projects.map( p => {
        if ( s === p.id ) selections.push( p );

        return null;
      } ) );

      return selections;
    }

    return [];
  };

  const hasSelectedAllDrafts = () => {
    const draftProjects = getDraftProjects( data || null );
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
    const { first, skip } = variables;

    return projects && projects.slice( skip, skip + first );
  };

  const renderMenu = () => {
    if ( !data ) return null;

    const projectsOnPage = getProjectsOnPage( data );
    const projectsOnPageCount = getCount( projectsOnPage );
    const selections = getSelectedProjects( data );
    const selectionsCount = getCount( selections );
    const isDisabled = data && !data.length;
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
            <Fragment>
              <span className="separator">|</span>
              <UnpublishProjects
                team={ team }
                handleResetSelections={ handleResetSelections }
                handleActionResult={ handleActionResult }
                showConfirmationMsg={ showConfirmationMsg }
                selections={ selections }
                variables={ variables }
              />
            </Fragment>
          ) }
        </div>
      </Fragment>
    );
  };

  return <div className="actionsMenu_wrapper">{ renderMenu() }</div>;
};

TableActionsMenu.propTypes = {
  data: PropTypes.array,
  error: PropTypes.object,
  loading: PropTypes.bool,
  handleResetSelections: PropTypes.func,
  refetch: PropTypes.func,
  refetchCount: PropTypes.func,
  toggleAllItemsSelection: PropTypes.func,
  variables: PropTypes.object,
};

export default TableActionsMenu;
