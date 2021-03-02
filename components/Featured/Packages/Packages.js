import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Grid } from 'semantic-ui-react';
import { normalizeItem } from 'lib/elastic/parser';
import { typeRequestDesc, getTermsRequest } from 'lib/elastic/api';

import config from 'config';
import PackageCard from 'components/Package/PackageCard/PackageCard';
import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import './Packages.scss';

const archiveLink = () => <a href={ config.PRESS_GUIDANCE_DB_URL } rel="noopener noreferrer" target="_blank">archived press guidance database</a>;

const Packages = ( { pin: idsToPin, user } ) => {
  const [items, setItems] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );

  useEffect( () => {
    let mounted = true;

    setState( { loading: true, error: false } );

    /**
     * Executes a fetch for specific packages (to pin) and most recent packages
     * @param {array} pinnedIds package ids to fetch
     * @returns [pinned, recents]
     */
    const getPinnedAndRecents = async ( pinnedIds = [] ) => Promise.all( [
      getTermsRequest( 'id', pinnedIds, user ),
      typeRequestDesc( 'package', user ),
    ] ).catch( err => console.log( err ) );


    /**
     * Determines which packages to display by fetching both specific packages ids,
     * if pinned items exist, and 4 most recent packages. Populates items array with pinned
     * packages and fills any remaining slots with most recent packages. items array can have
     * at most 4 items
     */
    const getPackages = async () => {
      const [pinned, recents] = await getPinnedAndRecents( idsToPin );

      const pinnedItems = Array.isArray( pinned?.hits?.hits ) ? pinned.hits.hits : [];
      const recentItems = Array.isArray( recents?.hits?.hits ) ? recents.hits.hits.slice( 0, 4 - idsToPin.length ) : [];

      let packages = [...pinnedItems, ...recentItems];

      if ( packages?.length ) {
        packages = packages.map( item => {
          const _item = normalizeItem( item );

          return ( idsToPin.includes( _item.id ) ) ? { ..._item, pin: true } : _item;
        } );

        if ( mounted ) {
          setState( { loading: false, error: false } );
          setItems( packages );
        }
      } else {
        setState( { loading: false, error: false } );
      }
    };

    getPackages();

    return () => {
      mounted = false;
    };
  }, [user, idsToPin] );

  if ( state.error ) {
    return <FeaturedError type="press guidance packages" />;
  }

  if ( state.loading ) {
    return <FeaturedLoading loading={ state.loading } />;
  }

  if ( !items.length ) return null;

  return (
    <section className="latestPackages_section">
      <div className="latestPackages_container">
        <div className="latestPackages_header">
          <h1 className="latestPackages_header_title">Latest Guidance Packages</h1>
          <Link
            href={ {
              pathname: '/results',
              query: {
                language: 'en-us',
                sortBy: 'created',
                postTypes: ['package'],
              },
            } }
          >
            <a className="latestPackages_header_link">Browse All</a>
          </Link>
        </div>
        <Grid className="latestPackages_grid">
          { items.map( pkg => (
            <Grid.Column
              key={ pkg.id }
              className={ items.length > 3 ? 'flex-column' : 'card-min-width' }
            >
              <PackageCard item={ pkg } pin />
            </Grid.Column>
          ) ) }
        </Grid>
        <p className="latestPackages_guidance_link">
          { 'For press guidance and releases from before 04/27/2020, please visit the ' }
          { archiveLink() }
          .
        </p>
      </div>
    </section>
  );
};

Packages.propTypes = {
  user: PropTypes.object,
  pin: PropTypes.array,
};

export default Packages;
