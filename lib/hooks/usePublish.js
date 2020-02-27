import { useState, useEffect } from 'react';
import { useRouter } from 'next/router';

/**
 * When an object is published/unpublished, polling is started to check for changes in object status
 * The server will return a success or failure status. Upon receiving status change, send mutation back
 * to the server to update object status with result from server
 * @param {function} startPolling graphQL function returned from useQuery
 * @param {function} stopPolling graphQL function returned from useQuery
 * @param {function} updateMutation graphQL mutation that updates applicable query on publish/unpublish success
 * @param {boolena} goToDashboardOnSuccess redirect to dashboard on success?
 */
function usePublish( startPolling, stopPolling, updateMutation, goToDashboardOnSuccess = true ) {
  const [publishing, setPublishing] = useState( false );
  const [publishError, setPublishError] = useState( {} );
  const router = useRouter();

  /**
   * If operation fails, reset status to state before operation was attempted & show error to user
   * @param {string} id object id
   * @param {string} status status returned from server
   */
  const handlePublishError = ( id, status ) => {
    setPublishError( {
      otherError: `ERROR: Package failed to ${status.substr( 0, status.indexOf( '_' ) ).toLowerCase()}`
    } );
    stopPolling();
    setPublishing( false );

    const updatedStatus = status === 'PUBLISH_FAILURE' ? 'DRAFT' : 'PUBLISHED';

    updateMutation( {
      variables: {
        data: { status: updatedStatus },
        where: { id }
      }
    } );
  };

  /**
   * If operation succeeds, update status to reflect new state
   * @param {string} id object id
   * @param {string} status status returned from server
   */
  const handlePublishSuccess = ( id, status ) => {
    stopPolling();
    setPublishing( false );

    const updatedStatus = status === 'PUBLISH_SUCCESS' ? 'PUBLISHED' : 'DRAFT';
    const updatedPublishAt = status === 'PUBLISH_SUCCESS' ? new Date().toISOString() : null;

    updateMutation( {
      variables: {
        data: {
          status: updatedStatus,
          publishedAt: updatedPublishAt
        },
        where: { id }
      }
    } );
  };

  /**
   * Called from containing component when component detects change in status
   * @param {object} project object being published/unpublished
   */
  const handleStatusChange = project => {
    const { id } = project;
    const { status } = project;

    if ( status === 'PUBLISH_FAILURE' || status === 'UNPUBLISH_FAILURE' ) {
      handlePublishError( id, status );
    }

    if ( status === 'PUBLISH_SUCCESS' || status === 'UNPUBLISH_SUCCESS' ) {
      handlePublishSuccess( id, status );
      if ( goToDashboardOnSuccess ) {
        router.push( '/admin/dashboard' );
      }
    }
  };

  /**
   * Called from containing component when component publishes/unpublishes
   * Sets publishing status and starts/stops polloing
   * @param {string} id id of object to be published/unpublished
   * @param {function} pulishFunc component publish/unpublish graphQL mutation
   */
  const executePublishOperation = async ( id, pulishFunc ) => {
    if ( !publishing ) {
      try {
        setPublishing( true );
        await pulishFunc( { variables: { id } } );
        startPolling( 100 );
      } catch ( err ) {
        setPublishing( false );
        setPublishError( err );
        stopPolling();
      }
    }
  };

  // Kill any polling on component unmount
  useEffect(
    () => () => {
      stopPolling();
    },
    []
  );

  // public api
  return {
    publishing,
    publishError,
    executePublishOperation,
    handleStatusChange
  };
}

export default usePublish;