import React, { useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { DashboardContext } from 'context/dashboardContext';

const UnpublishProjects = ( {
  handleResetSelections,
  handleActionResult,
  showConfirmationMsg,
  selections,
  variables,
  hasSelectedAllDrafts,
} ) => {
  const { state } = useContext( DashboardContext );
  const [bulkUnpublish] = useMutation( state.queries.unpublish );
  const [bulkStatusUpdate] = useMutation( state.queries.status );

  // 1 - Using new 'metaContent' query - only fetches id, publishedAt & status fields
  // prior query for all graphic content causes a network strain, browser has to download all img files again which are not needed here
  // 2 - Not using stopPolling, calling stopPolling doesn not allow bulk unpublishing to finish
  const { data, startPolling, stopPolling } = useQuery( state.queries.metaContent, {
    variables: { ...variables },
  } );

  const published = selections.filter( p => p.status === 'PUBLISHED' );

  /**
   * Sends mutation to server to update status based on whether operation was a success or failure
   * If success, mark as 'DRAFT'
   * If failure, reset to 'PUBLISHED'
   * @param {array} items array of items that need status updates
   */
  const updateStatus = items => Promise.all( items.map( item => {
    const { id, status, publishedAt } = item;

    return bulkStatusUpdate( {
      variables: {
        data: {
          status: status === 'UNPUBLISH_SUCCESS' ? 'DRAFT' : 'PUBLISHED',
          publishedAt: status === 'UNPUBLISH_SUCCESS' ? null : publishedAt,
        },
        where: { id },
      },
    } );
  } ) );

  /**
   * Called when poll query changes. A change to the status of each item
   * that is unpublished will trigger this check. The server will mark
   * each items as a 'UNPUBLISH_SUCCESS' or 'UNPUBLISH_FAILURE
   */
  const checkUnpublishStatus = async () => {
    const { projectType } = state;

    if ( data && projectType ) {
      const items = data[projectType] || [];

      // Determine how many items have completed (either success or failure)
      const updates = items.filter(
        item => item.status === 'UNPUBLISH_SUCCESS' || item.status === 'UNPUBLISH_FAILURE',
      );

      await updateStatus( updates );
    }
  };

  // Used to detect whether an unpublish operation has completed
  // The poll will refetch data which will be different if an object
  // status has changed
  useEffect( () => {
    if ( data ) {
      checkUnpublishStatus();
    }
  }, [data] );


  const unpublishProject = async project => {
    const result = await bulkUnpublish( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'unpublish',
    } ) );

    handleActionResult( result );
  };

  const handleUnpublishProjects = async () => {
    // watch for status changes as projects are unpublished
    startPolling( 300 );
    await Promise.all( published.map( unpublishProject ) );
    handleResetSelections();
    showConfirmationMsg();
  };

  // Display empty span if only drafts selected,
  // we need UnpublishProjects to remain mounted so polling is not stopped prematurely
  // instead of only mounting component if there are any published projects selected
  // see TableActionsMenu - ln. 230
  if ( hasSelectedAllDrafts ) return (
    <span />
  );

  return (
    <Popup
      trigger={ (
        <Button
          className="unpublish"
          size="mini"
          basic
          onClick={ handleUnpublishProjects }
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
};

UnpublishProjects.propTypes = {
  handleActionResult: PropTypes.func,
  handleResetSelections: PropTypes.func,
  showConfirmationMsg: PropTypes.func,
  selections: PropTypes.array,
  variables: PropTypes.object,
  hasSelectedAllDrafts: PropTypes.bool,
};

export default UnpublishProjects;
