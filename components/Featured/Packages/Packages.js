import React, { useContext } from 'react';
import Link from 'next/link';
import { Grid, Message } from 'semantic-ui-react';

import config from 'config';
import PackageCard from 'components/Package/PackageCard/PackageCard';
import { FeaturedContext } from 'context/featuredContext';

import './Packages.scss';

const archiveLink = () => <a href={ config.PRESS_GUIDANCE_DB_URL } rel="noopener noreferrer" target="_blank">archived press guidance database</a>;

const Packages = () => {
  const { state } = useContext( FeaturedContext );

  if ( state?.error ) {
    return (
      <section className="latestPackages_section">
        <Message>Oops, something went wrong. We are unable to load the most recent guidance packages.</Message>
      </section>
    );
  }

  const packages = state?.recents?.packages ? state.recents.packages : [];

  if ( !packages.length ) return null;

  return (
    <section className="latestPackages_section">
      <div className="latestPackages_container">
        <div className="latestPackages_header">
          <h1 className="latestPackages_header_title">Latest Guidance Packages</h1>
          <Link
            href={ {
              pathname: '/results',
              query: { language: 'en-us', sortBy: 'created', postTypes: ['package'] },
            } }
          >
            <a className="latestPackages_header_link">Browse All</a>
          </Link>
        </div>
        <Grid className="latestPackages_grid">
          { packages.map( pkg => (
            <Grid.Column
              key={ pkg.id }
              className={ packages.length > 3 ? 'flex-column' : 'card-min-width' }
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

export default Packages;
