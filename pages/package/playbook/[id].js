import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Playbook from 'components/Playbook/Playbook';

import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';

const PlaybookPage = ( { id = null, playbook = null } ) => {
  const playbookExists = id && playbook;

  return (
    <ContentPage fullWidth item={ playbook }>
      { playbookExists && (
        <Playbook id={ id } item={ playbook } />
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
