import { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { normalizeItem } from 'lib/elastic/parser';
import { typeRequestDesc, getTermsRequest } from 'lib/elastic/api';
import useIsMounted from 'lib/hooks/useIsMounted';
import config from 'config';
import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';
import PlaybookCard from 'components/Playbook/PlaybookCard/PlaybookCard';

import styles from './Playbooks.module.scss';

const archiveLink = () => <a href={ config.INFO_CENTRAL_URL } rel="noopener noreferrer" target="_blank">InfoCentral</a>;

const Playbooks = ( { pin: idsToPin, user } ) => {
  const [items, setItems] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );
  const isMounted = useIsMounted();

  useEffect( () => {
    setState( { loading: true, error: false } );

    /**
     * Executes a fetch for specific playbooks (to pin) and most recent playbooks
     * @param {array} pinnedIds package ids to fetch
     * @returns [pinned, recents]
     */
    const getPinnedAndRecents = async ( pinnedIds = [] ) => Promise.all( [
      getTermsRequest( 'id', pinnedIds, user ),
      typeRequestDesc( 'playbook', user ),
    ] ).catch( err => console.log( err ) );

    /**
     * Determines which playbooks to display by fetching both specific playbooks ids,
     * if pinned items exist, and 4 most recent playbooks. Populates items array with pinned
     * playbooks and fills any remaining slots with most recent playbooks. items array can have
     * at most 4 items
     */
    const getPlaybooks = async () => {
      const [pinned, recents] = await getPinnedAndRecents( idsToPin );

      const pinnedItems = Array.isArray( pinned?.hits?.hits ) ? pinned.hits.hits : [];
      const recentItems = Array.isArray( recents?.hits?.hits ) ? recents.hits.hits : [];

      let playbooks = [...pinnedItems, ...recentItems];

      // Remove any pinned playbooks that may appear in recentItems. Ensure array length is at most 4
      playbooks = [...new Map( playbooks.map( pkg => [pkg._id, pkg] ) ).values()].slice( 0, 4 );

      if ( playbooks?.length ) {
        playbooks = playbooks.map( item => {
          const _item = normalizeItem( item );

          // if item is to be pinned, add pin prop to item so render method
          // knows to display featured ribbon
          return ( idsToPin?.includes( _item.id ) ) ? { ..._item, pin: true } : _item;
        } );

        if ( isMounted ) {
          setState( { loading: false, error: false } );
          setItems( playbooks );
        }
      } else {
        setState( { loading: false, error: false } );
      }
    };

    getPlaybooks();
  }, [user, idsToPin] );

  if ( state.error ) {
    return <FeaturedError type="playbooks" />;
  }

  if ( state.loading ) {
    return <FeaturedLoading loading={ state.loading } />;
  }

  if ( !items.length ) return null;

  return (
    <section
      className={ styles.playbooks }
      aria-label="Latest Playbooks"
    >
      <div className={ styles.container }>
        <div className={ styles.header }>
          <h2 className={ styles.title }>Latest Playbooks</h2>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                sortBy: 'created',
                postTypes: ['playbook'],
              },
            } }
          >
            <a className={ styles['browse-all'] }>Browse All Playbooks</a>
          </Link>
        </div>

        <div className={ styles.grid }>
          { items.map( playbook => (
            <PlaybookCard key={ playbook.id } heading="h3" item={ playbook } />
          ) ) }
        </div>

        <p className={ styles['archive-link'] }>
          { 'For playbooks from before July 23, 2021, please visit ' }
          { archiveLink() }
          .
        </p>
      </div>
    </section>
  );
};

Playbooks.propTypes = {
  user: PropTypes.object,
  pin: PropTypes.array,
};

export default Playbooks;
