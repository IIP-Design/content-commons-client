import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Grid } from 'semantic-ui-react';
import { normalizeItem } from 'lib/elastic/parser';
import { typeRequestDesc } from 'lib/elastic/api';

import config from 'config';
import PackageCard from 'components/Package/PackageCard/PackageCard';
import FeaturedLoading from '../FeaturedLoading';
import FeaturedError from '../FeaturedError';

import './Packages.scss';

const archiveLink = () => <a href={ config.PRESS_GUIDANCE_DB_URL } rel="noopener noreferrer" target="_blank">archived press guidance database</a>;

const Packages = ( { postType, user } ) => {
  const [items, setItems] = useState( [] );
  const [state, setState] = useState( { loading: false, error: false } );

  useEffect( () => {
    let mounted = true;

    setState( { loading: true, error: false } );

    typeRequestDesc( postType, user )
      .then( res => {
        // check to ensure we are mounted in the event we unmounted before request returned
        if ( mounted ) {
          const packages = res?.hits?.hits?.map( item => normalizeItem( item, res.locale ) );

          if ( packages ) {
            setState( { loading: false, error: false } );
            setItems( packages );
          }
        }
      } )
      .catch( err => {
        setState( { loading: false, error: true } );
      } );


    return () => {
      mounted = false;
    };
  }, [postType, user] );

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
              <PackageCard item={ pkg } />
            </Grid.Column>
          ) ) }
        </Grid>
        <p className="latestPackages_guidance_link">
          { 'For press guidance and releases from before 04/27/2020, please visit the ' }
          { archiveLink() }
          { '.' }
        </p>
      </div>
    </section>
  );
};

Packages.propTypes = {
  postType: PropTypes.string,
  user: PropTypes.object,
};

export default Packages;
