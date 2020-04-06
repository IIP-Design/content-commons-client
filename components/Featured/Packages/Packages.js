import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Link from 'next/link';
import { Grid, Message } from 'semantic-ui-react';
import PackageCard from 'components/Package/PackageCard/PackageCard';
import './Packages.scss';

const renderError = () => (
  <section className="latestPackages_section">
    <Message>Oops, something went wrong.  We are unable to load the most recent guidance packages.</Message>
  </section>
);

const Packages = props => {
  const { featured, packages } = props;
  if ( featured?.error ) {
    return renderError();
  }

  if ( !packages?.length ) return null;

  return (
    <section className="latestPackages_section">
      <div className="latestPackages_container">
        <div className="latestPackages_header">
          <h1 className="latestPackages_header_title">Latest Guidance Packages</h1>
          <Link
            href={ {
              pathname: '/results',
              query: { language: 'en-us', sortBy: 'published', postTypes: ['package'] }
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
      </div>
    </section>
  );
};

Packages.propTypes = {
  featured: PropTypes.object,
  packages: PropTypes.array
};

const mapStateToProps = ( state, props ) => ( {
  featured: state.featured,
  packages: state.featured.recents[props.postType],
} );

export default connect( mapStateToProps )( Packages );
