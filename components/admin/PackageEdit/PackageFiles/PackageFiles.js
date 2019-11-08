import React from 'react';
import PropTypes from 'prop-types';
// import { graphql } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import PressPackageFile from './PressPackageFile/PressPackageFile';

const PackageFiles = props => {
  const { error, loading, package: pkg } = props.data;

  if ( loading ) {
    return (
      <div style={ {
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
          content="Loading package file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !pkg || !getCount( pkg ) ) return null;

  const { files: units } = pkg;
  if ( !units || getCount( units ) === 0 ) return null;

  return (
    <section className="section section--package-files package-files layout">
      <h2 className="headline uppercase">
        { `Uploaded ${getPluralStringOrNot( units, 'File' )}` }
      </h2>
      { units.map( unit => (
        <PressPackageFile key={ unit.id } unit={ unit } />
      ) ) }
    </section>
  );
};

PackageFiles.propTypes = {
  // id: PropTypes.string,
  data: PropTypes.object
};

export default PackageFiles;
