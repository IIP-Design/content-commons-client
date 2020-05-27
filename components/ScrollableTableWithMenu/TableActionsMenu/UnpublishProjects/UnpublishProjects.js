import React, { useContext, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Button, Popup } from 'semantic-ui-react';
import { useMutation, useQuery } from '@apollo/react-hooks';

import useIsMounted from 'lib/hooks/useIsMounted';
import { DashboardContext } from 'context/dashboardContext';

const UnpublishProjects = ( {
  handleResetSelections,
  handleActionResult,
  showConfirmationMsg,
  selections,
  variables,
} ) => {
  const { state } = useContext( DashboardContext );

  const isMounted = useIsMounted();

  /**
   * Used to track number of items that need to be unpublished
   * Cannot use 'published' as this changes with each render
   */
  const [numToUnpublish, setNumToUnpublish] = useState( 0 );

  const [bulkUnpublish] = useMutation( state.queries.unpublish );
  const [bulkStatusUpdate] = useMutation( state.queries.status );

  const { data, startPolling, stopPolling } = useQuery( state.queries.content, {
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
  const checkUnpublishStatus = () => {
    const items = data?.packages ? data.packages : data.videoProjects;

    if ( items ) {
      // Determine how many items have completed (either success or failure)
      const updates = items.filter(
        item => item.status === 'UNPUBLISH_SUCCESS' || item.status === 'UNPUBLISH_FAILURE',
      );

      // Compare the number of completed items against the number of operation requested
      // to determine if the bulk operation is complete
      // If it is, stop polling
      if ( numToUnpublish === updates.length ) {
        updateStatus( updates ).finally( () => {
          // Finally executes for both success and failure
          // This will ensure polling is stopped
          stopPolling();
          if ( isMounted ) {
            setNumToUnpublish( 0 );
          }
        } );
      }
    }
  };

  // Used to detect whether an unpublish operation has completed
  // The poll will refetch data which will be different if an object
  // status has changed
  useEffect( () => {
    if ( data ) {
      checkUnpublishStatus();
    }

    // Ensure polling does not continue on unmount
    return () => {
      stopPolling();
    };
  }, [data] );


  const unpublishProject = async project => {
    // Store the number of projects that need to be unpublished.
    // Need to do this as published changes
    setNumToUnpublish( published.length );

    const result = await bulkUnpublish( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'unpublish',
    } ) );

    handleActionResult( result );
  };

  const handleUnpublishProjects = async () => {
    // watch for status changes as projects are unpublished
    startPolling( 1000 );

    await Promise.all( published.map( unpublishProject ) );
    handleResetSelections();
    showConfirmationMsg();
  };

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
};

export default UnpublishProjects;
