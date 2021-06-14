import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import ErrorSection from 'components/errors/ErrorSection';
import Playbook from 'components/Playbook/Playbook';
import { mockItem } from 'components/Playbook/mocks';

import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

const PlaybookPage = ( { id, playbook } ) => {
  const playbookExists = id && playbook;

  return (
    <ContentPage fullWidth item={ mockItem }>
      { playbookExists && (
        <Playbook id={ id } item={ playbook } />
      ) }
      { !playbookExists && (
        <ErrorSection statusCode={ 404 } title="Playbook Not Found" />
      ) }
    </ContentPage>
  );
};

export async function getServerSideProps( { query: { id } } ) {
  const props = { id };

  const apolloClient = new ApolloClient( {
    cache: new InMemoryCache(),
    link: new HttpLink( {
      uri: process.env.REACT_APP_APOLLO_ENDPOINT,
      fetch,
    } ),
  } );

  if ( id ) {
    try {
      const { data } = await apolloClient.query( {
        query: PLAYBOOK_QUERY,
        variables: { id },
      } );

      props.playbook = data.playbook;
    } catch ( err ) {
      console.log( err );
    }
  }

  return { props };
}

PlaybookPage.propTypes = {
  playbook: PropTypes.object,
  id: PropTypes.string,
};

export default PlaybookPage;
