import { useState, useEffect } from 'react';
import { findAllValuesForKey } from 'lib/utils';

/**
 * Hook that listens for changes to the supplied object
 * It recursively compares the object's nested 'updatedAt' props against
 * its 'publishedAt' date to determine if there has been an update
 * @param {object} object object to watch for changes
 */
function useIsDirty( object ) {
  const [isDirty, setIsDirty] = useState( false );

  // To do: compare actual values as object is updated and if
  // value is reset, it will show as updated as the change and
  // reset with update the timestamp
  useEffect( () => {
    // Recursively check objects updateAt props
    const hasUnpublishedUpdates = project => {
      // Get all nested 'updatedAt' values
      const updatedAts = findAllValuesForKey( project, 'updatedAt' );

      // Get the most recent updatedAt value
      const latestUpdatedAt = updatedAts.sort().pop();

      // Round date to nearest second to account for small differences between updates
      const updatedDate = new Date( latestUpdatedAt );
      const updated = Math.floor( updatedDate.getTime() / 1000 );

      const publishedDate = new Date( project.publishedAt );
      const published = Math.floor( publishedDate.getTime() / 1000 );

      // Compare
      const isAfter = published < updated;

      return isAfter;
    };

    /**
     * Only check if project has been published
     * and debounce to avoid too many re-renders
     */
    if ( object?.publishedAt ) {
      const debouncer = setTimeout( () => {
        setIsDirty( hasUnpublishedUpdates( object ) );
      }, 1000 );

      return () => {
        clearTimeout( debouncer );
      };
    }
  }, [object] );

  return isDirty;
}

export default useIsDirty;
