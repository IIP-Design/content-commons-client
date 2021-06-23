import { ApolloClient, HttpLink, InMemoryCache, useQuery } from '@apollo/client';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ApolloError from 'components/errors/ApolloError';
import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Playbook from 'components/Playbook/Playbook';

import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

const PlaybookPage = ( { id, playbook } ) => {
  const { data, error, loading } = useQuery( PLAYBOOK_QUERY, {
    variables: { id },
    skip: !!playbook,
  } );

  if ( loading ) {
    return (
      <div>
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading Playbook preview..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;

  const item = playbook || data?.playbook;

  return (
    <ContentPage fullWidth item={ item }>
      { item && (
        <Playbook item={ item } />
      ) }
    </ContentPage>
  );
};

export async function getServerSideProps( { query: { id } } ) {
  const props = {};

  const apolloClient = new ApolloClient( {
    cache: new InMemoryCache(),
    link: new HttpLink( {
      uri: process.env.REACT_APP_APOLLO_ENDPOINT,
      fetch,
    } ),
  } );

  if ( id ) {
    props.id = id;

    try {
      const { data } = await apolloClient.query( {
        query: PLAYBOOK_QUERY,
        variables: { id },
      } );

      props.playbook = data.playbook;
    } catch ( err ) {
      console.log( err );

      return { props };
    }
  }

  return { props };
}

PlaybookPage.propTypes = {
  playbook: PropTypes.object,
  id: PropTypes.string,
};

export default PlaybookPage;
