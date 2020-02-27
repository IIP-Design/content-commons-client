import { useState, useEffect } from 'react';
import { findAllValuesForKey } from 'lib/utils';
import moment from 'moment';

/**
 * Hook that lisens for changes to the supplied object
 * It recursively compares the object's nested 'updatedAt' props against
 * its 'publishedAt' date to determine if there has been an update
 * @param {object} object object to watch for changes
 */
function useIsDirty ( object ) {
  const [isDirty, setIsDirty] = useState( false );

  // Recursively check objects updateAt props
  const hasUnpublishedUpdates = project => {
    // Get all nested 'updatedAt' values as updatedAt at project level'
    // does not account for updates futher down the tree
    const updatedAts = findAllValuesForKey( project, 'updatedAt' );

    // Get the most recent updatedAt value
    const latestUpdatedAt = updatedAts.sort().pop();

    return moment( latestUpdatedAt ).isAfter( project.publishedAt, 'second' );
  };


  useEffect( () => {
    if ( object?.publishedAt ) {
      setIsDirty( hasUnpublishedUpdates( object ) );
    }
  }, [object] );

  return isDirty;
}

export default useIsDirty;
