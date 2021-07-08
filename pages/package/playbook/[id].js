import { useEffect, useState } from 'react';
import { Loader } from 'semantic-ui-react';
import PropTypes from 'prop-types';

import ContentPage from 'components/PageTypes/ContentPage/ContentPage';
import Playbook from 'components/Playbook/Playbook';

import { getDataFromHits, normalizeItem } from 'lib/elastic/parser';
import { getItemByIdRequest } from 'lib/elastic/api';
import { useAuth } from 'context/authContext';

/**
 * Queries the public API for a given playbook.
 * @param {string} id The id of the desired playbook.
 * @param {Object} user The current user object.
 * @returns {Object} The playbook data.
 */
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

  return { item: null };
};

const PlaybookPage = ( { query } ) => {
  const id = query?.id;
  const { user } = useAuth();

  const [loading, setLoading] = useState( true );
  const [item, setItem] = useState( null );

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

PlaybookPage.propTypes = {
  query: PropTypes.shape( {
    id: PropTypes.string,
  } ),
};

export default PlaybookPage;
