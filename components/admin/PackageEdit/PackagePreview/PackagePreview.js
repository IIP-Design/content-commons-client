import React from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/react-hooks';
import { Loader } from 'semantic-ui-react';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import ApolloError from 'components/errors/ApolloError';

const PackagePreview = props => {
  const { loading, error, data } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id: props.id },
    displayName: 'PackageQuery',
    skip: !props.id
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

  return <p>package: { props.id }</p>;
};

PackagePreview.propTypes = {
  id: PropTypes.string
};

export default PackagePreview;
