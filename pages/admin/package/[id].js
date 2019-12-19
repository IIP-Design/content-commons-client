import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import PackageEdit from 'components/admin/PackageEdit/PackageEdit';

/**
 * Returns query applicable to content type
 * @param {String} content content type, i.e., video, image, etc
 */
const getPackageQuery = content => {
  switch ( content ) {
    case 'package':
      return PACKAGE_QUERY;

    default:
      return null;
  }
};

// no id redirect handled by `./index.js`
const PackagePage = props => <PackageEdit data={ props.data } />;

PackagePage.getInitialProps = async ( { query, apolloClient } ) => {
  // empty query redirect handled by `./index.js`

  if ( !query.id ) {
    return {};
  }

  // Fetch applicable query and populate package data for use in child components
  const data = await apolloClient
    .query( {
      /**
       * no content query param as with projects,
       * so entering 'package' for now
       */
      query: getPackageQuery( 'package' ),
      variables: { id: query.id }
    } )
    .catch( err => console.dir( err ) );

  return data;
};

PackagePage.propTypes = {
  data: PropTypes.object
};

export default withRouter( PackagePage );
