import React from 'react';
import PropTypes from 'prop-types';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import dynamic from 'next/dynamic';
import fetch from 'isomorphic-unfetch';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

const Playbook = dynamic( () => import( /* webpackChunkName: "playbook" */ 'components/Playbook/Playbook' ) );
const PlaybookEdit = dynamic( () => import( /* webpackChunkName: "playbookEdit" */ 'components/admin/PlaybookEdit/PlaybookEdit' ) );

/**
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PlaybookPage = ( { playbook, query } ) => {
  const [id, action] = query.slug;

  if ( action === 'preview' ) {
    return <Playbook item={ playbook } />;
  }

  return <PlaybookEdit id={ id } playbook={ playbook } />;
};

export async function getServerSideProps( { query } ) {
  const [id] = query.slug;

  const apolloClient = new ApolloClient( {
    cache: new InMemoryCache(),
    link: new HttpLink( {
      uri: process.env.REACT_APP_APOLLO_ENDPOINT,
      fetch,
    } ),
  } );

  try {
    const { data } = await apolloClient.query( {
      query: PLAYBOOK_QUERY,
      variables: { id },
    } );

    return {
      props: {
        playbook: data.playbook,
      },
    };
  } catch ( err ) {
    console.log( err );

    return {
      props: {},
    };
  }
}

PlaybookPage.propTypes = {
  playbook: PropTypes.object,
  query: PropTypes.object,
};

export default PlaybookPage;
