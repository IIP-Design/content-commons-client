import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/react-hooks';
import useIsMounted from 'lib/hooks/useIsMounted';
import { Button, Popup } from 'semantic-ui-react';
import {
  UNPUBLISH_VIDEO_PROJECT_MUTATION,
  TEAM_VIDEO_PROJECTS_QUERY,
  UPDATE_VIDEO_STATUS_MUTATION
} from 'lib/graphql/queries/video';
import {
  UNPUBLISH_PACKAGE_MUTATION,
  TEAM_PACKAGES_QUERY,
  UPDATE_PACKAGE_STATUS_MUTATION
} from 'lib/graphql/queries/package';


const UnpublishProjects = props => {
  const {
    team,
    handleResetSelections,
    handleActionResult,
    showConfirmationMsg,
    selections,
    variables
  } = props;

  const isMounted = useIsMounted();

  // This following if statements assume that we have a video content type if
  // contentTypes do not contain PACKAGE.
  // This solution is not scalable and will need to be revisited when time permits
  const isPackage = team?.contentTypes?.includes( 'PACKAGE' );

  // qry to poll when bulk unpublish starts
  const pollQry = isPackage
    ? TEAM_PACKAGES_QUERY
    : TEAM_VIDEO_PROJECTS_QUERY;

  const unpublishMutation = isPackage
    ? UNPUBLISH_PACKAGE_MUTATION
    : UNPUBLISH_VIDEO_PROJECT_MUTATION;

  // after bulk unpublish completes, each the status of each item
  // will need to be updated to reflect success/ failure
  const statusUpdateMutation = isPackage
    ? UPDATE_PACKAGE_STATUS_MUTATION
    : UPDATE_VIDEO_STATUS_MUTATION;

  // Used to track number of items that need to be unpublished
  // Cannot use 'published' as this changes with each render
  const [numToUnpublish, setNumToUnpublish] = useState( 0 );

  const [bulkUnpublish] = useMutation( unpublishMutation );
  const [bulkStatusUpdate] = useMutation( statusUpdateMutation );

  const { data, startPolling, stopPolling } = useQuery( pollQry, {
    variables: { ...variables }
  } );

  const published = selections.filter( p => p.status === 'PUBLISHED' );

  /**
   * Sends mutation to server to update status based on
   * whether operation was a success or failure
   * If success, mark as 'DRAFT'
   * If failtue, reset to 'PUBLISHED'
   * @param {array} items array of items that need status updates
   */
  const updateStatus = items => Promise.all( items.map( item => {
    const { id, status, publishedAt } = item;
    const updatedStatus = status === 'UNPUBLISH_SUCCESS' ? 'DRAFT' : 'PUBLISHED';
    const updatedPublishedAt = status === 'UNPUBLISH_SUCCESS' ? null : publishedAt;
    return bulkStatusUpdate( {
      variables: {
        data: {
          status: updatedStatus,
          publishedAt: updatedPublishedAt
        },
        where: { id }
      }
    } );
  } ) );

  /**
   * Called when poll query changes. A change to the status of each item
   * that is unpublished will trigger this check.  The server will mark
   * each items as a 'UNPUBLISH_SUCCESS' or 'UNPUBLISH_FAILURE
   */
  const checkUnpublishStatus = () => {
    const items = data?.packages ? data.packages : data.videoProjects;
    if ( items ) {
      // Determine how many items have completed (weither success or failure)
      const updates = items.filter(
        item => item.status === 'UNPUBLISH_SUCCESS' || item.status === 'UNPUBLISH_FAILURE'
      );

      // Compare the number of completed items against the number of operation requested
      // to determine if the bulk operation is cokplete
      // If it is, stop polling
      if ( numToUnpublish === updates.length ) {
        updateStatus( updates ).finally( () => {
          // Finally executes for both success and failure
          // This will ensure polling is stoppped
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
  }, [data] );

  // Enusre polling does not continue on unmount
  useEffect( () => () => {
    stopPolling();
  }, [] );


  const unpublishProject = async project => {
    // Store the number of projects that need to be unpublished.
    // Need to do this as published changes
    setNumToUnpublish( published.length );

    const result = await bulkUnpublish( { variables: { id: project.id } } ).catch( error => ( {
      error,
      project,
      action: 'unpublish'
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
  team: PropTypes.object,
  handleActionResult: PropTypes.func,
  handleResetSelections: PropTypes.func,
  showConfirmationMsg: PropTypes.func,
  selections: PropTypes.array,
  variables: PropTypes.object
};

export default UnpublishProjects;
