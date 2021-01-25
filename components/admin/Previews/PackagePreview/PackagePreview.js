import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';

import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import { getCount } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import Package from 'components/Package/Package';
import PreviewLoader from 'components/admin/Previews/PreviewLoader/PreviewLoader';

import './PackagePreview.scss';

const PackagePreview = ( { id } ) => {
  const { loading, error, data } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id },
    displayName: 'PackageQuery',
    skip: !id,
  } );

  if ( error ) return <ApolloError error={ error } />;
  if ( loading ) return <PreviewLoader />;

  if ( !data ) return null;

  const { pkg } = data;

  if ( !getCount( pkg ) ) return null;

  const {
    createdAt, updatedAt, title, desc, team, type, documents,
  } = pkg;

  // Structure obj for use in Package component
  const pkgItem = {
    id,
    published: createdAt,
    modified: updatedAt,
    team,
    type,
    title,
    desc,
    documents,
  };

  return <Package item={ pkgItem } displayAsModal isAdminPreview useGraphQl />;
};

PackagePreview.propTypes = {
  id: PropTypes.string,
};

export default PackagePreview;
