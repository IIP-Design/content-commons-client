import React from 'react';
import PropTypes from 'prop-types';
import PlaybookEdit from 'components/admin/PlaybookEdit/PlaybookEdit';

/**
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PlaybookPage = ( { query } ) => {
  const [id] = query.slug;

  return <PlaybookEdit id={ id } />;
};

PlaybookPage.propTypes = {
  query: PropTypes.object,
};

export default PlaybookPage;
