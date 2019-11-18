import React from 'react';
import PropTypes from 'prop-types';
// import { graphql } from 'react-apollo';
import dynamic from 'next/dynamic';
import { Loader } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';
import './PackageFiles.scss';

const PressPackageFile = dynamic( () => import( /* webpackChunkName: "pressPackageFile" */ 'components/admin/PackageEdit/PackageFiles/PressPackageFile/PressPackageFile' ) );

const PackageFiles = props => {
  const { error, loading } = props.data;
  const pkg = props.data.package || {};

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

  const units = pkg.documents || [];
  if ( !units || getCount( units ) === 0 ) return null;

  return (
    <section className="edit-package__files package-files">
      <div className="heading">
        <div className="heading-group">
          <h3 className="headline uppercase">
            { `Package ${getPluralStringOrNot( units, 'File' )}` }
          </h3>
          <EditPackageFiles files={ units } />
        </div>
        <ButtonAddFiles className="basic edit-package__btn--add-more" accept=".doc, .docx" onChange={ () => {} } multiple>
          + Add Files
        </ButtonAddFiles>
      </div>

      <div className="files">
        { units.map( unit => {
          /**
           * Future: conditionally render `<PressPackageFile />`
           * or some other type of package file, e.g.,
           * `<FrontOfficePackageFile />`
           */
          if ( pkg.type === 'DAILY_GUIDANCE' ) {
            return <PressPackageFile key={ unit.id } unit={ unit } />;
          }
          return null;
          // return <SomeOtherPackageFile key={ unit.id } unit={ unit } />;
        } ) }
      </div>
    </section>
  );
};

PackageFiles.propTypes = {
  // id: PropTypes.string,
  data: PropTypes.object
};

export default PackageFiles;
