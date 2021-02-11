import React from 'react';
import PropTypes from 'prop-types';
import { redirectTo } from 'lib/browser';
import { withRouter } from 'next/router';
import isEmpty from 'lodash/isEmpty';

const PackagePageIndex = props => {
  // Handles client side route checking
  const isValidPath = query => query && query.id;

  if ( !isValidPath( props.query ) ) {
    props.router.push( '/admin/dashboard' );
  }

  return <div />;
};

PackagePageIndex.getInitialProps = async ( { query, res } ) => {
  // Send to dashboard if the query is not present
  // Handles server side route checking
  if ( isEmpty( query ) || !query.id ) {
    redirectTo( '/admin/dashboard', { res } );
  }

  return {};
};

PackagePageIndex.propTypes = {
  query: PropTypes.object,
  router: PropTypes.object,
};

export default withRouter( PackagePageIndex );
