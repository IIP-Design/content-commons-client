import { useEffect, useState } from 'react';

/**
 * Return the initial created and initial published status
 * @param {Object} dates Project date strings
 * @param {string} dates.updated Project updated date
 * @param {string} dates.published Project published date
 * @param {string} dates.initialPublished Project initial published date
 */
const useInitialStatus = ( {
  updated,
  published,
  initialPublished,
} ) => {
  const [statuses, setStatuses] = useState( {} );

  // truncate down to nearest second
  const getRoundedDate = date => (
    Math.floor( date.getTime() / 1000 )
  );

  // equal if within 1 second
  const areDatesEqual = ( date1, date2 ) => (
    Math.abs( date1 - date2 ) <= 1
  );

  useEffect( () => {
    const updatedDate = getRoundedDate( new Date( updated ) );
    const publishedDate = getRoundedDate( new Date( published ) );
    const initialPublishedDate = getRoundedDate( new Date( initialPublished ) );

    setStatuses( {
      isNeverPublished: !initialPublishedDate,
      isInitialPublish: !!initialPublishedDate && areDatesEqual( initialPublishedDate, publishedDate ),
      isSavedUpdate: !!publishedDate && !areDatesEqual( publishedDate, updatedDate ),
    } );
  }, [
    updated,
    published,
    initialPublished,
  ] );

  return statuses;
};

export default useInitialStatus;
