import { useEffect, useState } from 'react';
import { ApolloClient, HttpLink, InMemoryCache } from '@apollo/client';
import cookies from 'next-cookies';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Playbook from 'components/Playbook/Playbook';

import { CURRENT_USER_QUERY } from 'lib/graphql/queries/user';
import { getDataFromHits, normalizeItem } from 'lib/elastic/parser';
import { getItemByIdRequest } from 'lib/elastic/api';
import { useAuth } from 'context/authContext';

const getPlaybook = async ( id, user ) => {
  const response = await getItemByIdRequest( id, user );
  const item = getDataFromHits( response );

  if ( item && item[0] ) {
    const _locale = item[0]?._source?.language?.locale ? item[0]._source.language.locale : 'en-us';
    const _item = normalizeItem( item[0], _locale );

    return {
      item: _item,
    };
  }

  return {};
};

const PlaybookPage = ( { id, playbook } ) => {
  const [loading, setLoading] = useState( true );
  const [item, setItem] = useState( playbook || {} );

  const { user } = useAuth();

  useEffect( () => {
    const fetchData = async ( i, u ) => {
      const { item: data } = await getPlaybook( i, u );

      setItem( data );
    };

    if ( id && user ) {
      fetchData( id, user );
      setLoading( false );
    }
  }, [id, user] );

  if ( loading ) {
    return (
      <div>
        <Loader
          active
          inline="centered"
          style={ { margin: '6em 0 1em' } }
          content="Loading Playbook preview..."
        />
      </div>
    );
  }

  return (
    <ContentPage fullWidth item={ item }>
      <Playbook item={ item } />
    </ContentPage>
  );
};

export async function getServerSideProps( ctx ) {
  const id = ctx?.query?.id;

  const props = {
    id,
  };

  const apolloClient = new ApolloClient( {
    cache: new InMemoryCache(),
    link: new HttpLink( {
      uri: process.env.REACT_APP_APOLLO_ENDPOINT,
      fetch,
    } ),
  } );

  try {
    // Check for a valid session?
    const {
      data: { user },
    } = await apolloClient.query( { query: CURRENT_USER_QUERY, fetchPolicy: 'network-only' } );


    if ( user && user.id !== 'public' ) {
      // Add token to authenticate to elastic api to user.
      const { ES_TOKEN } = cookies( ctx );

      props.playbook = getPlaybook( id, { ...user, esToken: ES_TOKEN } );
    }

    props.playbook = {};
  } catch ( err ) {
    props.playbook = {};
  }

  return { props };
}

PlaybookPage.propTypes = {
  playbook: PropTypes.object,
  id: PropTypes.string,
};

export default PlaybookPage;
