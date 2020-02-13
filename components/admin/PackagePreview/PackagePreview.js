import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import { getCount } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import Package from 'components/Package/Package';
import './PackagePreview.scss';

const PackagePreview = ( { id } ) => {
  const { loading, error, data } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id },
    displayName: 'PackageQuery',
    skip: !id
  } );

  if ( loading ) {
    return (
      <div
        className="preview-package-loader"
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px'
        } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
        />
        <p>Loading the package preview...</p>
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !data ) return null;

  const { pkg } = data;
  if ( !getCount( pkg ) ) return null;

  const {
    createdAt, updatedAt, title, team, type, documents
  } = pkg;

  // Structure obj for use in Package component
  const pkgItem = {
    id,
    published: createdAt,
    modified: updatedAt,
    team,
    type,
    title,
    documents
  };

  return <Package item={ pkgItem } displayAsModal isAdminPreview useGraphQl />;
};

PackagePreview.propTypes = {
  id: PropTypes.string
};

export default PackagePreview;
