import React from 'react';
import PropTypes from 'prop-types';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import dynamic from 'next/dynamic';
import { Loader } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import { PACKAGE_FILES_QUERY } from 'lib/graphql/queries/package';
import ApolloError from 'components/errors/ApolloError';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';
import './PackageFiles.scss';

const PressPackageFile = dynamic( () => import( /* webpackChunkName: "pressPackageFile" */ 'components/admin/PackageEdit/PackageFiles/PressPackageFile/PressPackageFile' ) );

const PackageFiles = props => {
  if ( !props.data ) return null;
  const { error, loading } = props.data;

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

  const { pkg } = props.data;
  if ( !pkg || !getCount( pkg ) ) return null;

  const units = pkg.documents || [];
  if ( !units || getCount( units ) === 0 ) return null;

  return (
    <section className="edit-package__files package-files">
      <div className="heading">
        <div className="heading-group">
          <h3 className="headline uppercase">
            { `Uploaded ${getPluralStringOrNot( units, 'File' )}` }
          </h3>
          <EditPackageFiles files={ units } />
        </div>
      </div>

      <div className="files">
        { units.map( unit => {
          /**
           * Future: conditionally render `<PressPackageFile />`
           * or some other type of package file, e.g.,
           * `<FrontOfficePackageFile />`
           */
          if ( pkg.type === 'DAILY_GUIDANCE' ) {
            return <PressPackageFile key={ unit.id } id={ unit.id } />;
          }
          return null;
          // return <SomeOtherPackageFile key={ unit.id } id={ unit.id } />;
        } ) }
      </div>
    </section>
  );
};

PackageFiles.propTypes = {
  data: PropTypes.object
};

export default compose(
  graphql( PACKAGE_FILES_QUERY, {
    partialRefetch: true,
    options: props => ( {
      variables: { id: props.id }
    } ),
    skip: props => !props.id
  } )
)( PackageFiles );
