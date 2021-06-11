import PropTypes from 'prop-types';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import fetch from 'isomorphic-unfetch';
import Playbook from 'components/Playbook/Playbook';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

/**
 * 1. Redirect to dashboard if id is not present
 * 2. Execute a SSR query for initial page population from server
 * @param {*} props
 */
const PlaybookPage = props => {
  const {
    playbook,
    query: { id },
  } = props;

  return <Playbook id={ id } item={ playbook } />;
};

export async function getServerSideProps( { query } ) {
  const { id } = query;

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
