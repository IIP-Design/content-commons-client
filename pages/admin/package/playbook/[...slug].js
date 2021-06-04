import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';
import ApolloError from 'components/errors/ApolloError';
import Playbook from 'components/Playbook/Playbook';
import PlaybookEdit from 'components/admin/PlaybookEdit/PlaybookEdit';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

/**
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PlaybookPage = ( { query } ) => {
  const [id, param] = query.slug;
  const { loading, error, data } = useQuery( PLAYBOOK_QUERY, {
    variables: { id },
    skip: param !== 'preview',
  } );

  if ( loading ) return <p>Loading...</p>;
  if ( error ) return <ApolloError error={ error } />;

  if ( param && data?.playbook ) {
    return <Playbook item={ data.playbook } />;
  }

  return <PlaybookEdit id={ id } />;
};

PlaybookPage.propTypes = {
  query: PropTypes.object,
};

export default PlaybookPage;
