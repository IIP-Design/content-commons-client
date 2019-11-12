import React from 'react';
import PropTypes from 'prop-types';
// import { graphql } from 'react-apollo';
import dynamic from 'next/dynamic';
import { Button, Loader } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';

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
    <section className="section section--package-files package-files layout">
      <div className="heading">
        <h2 className="headline uppercase">
          { `Uploaded ${getPluralStringOrNot( units, 'File' )}` }
          { /**
             * This edit button will be the trigger
             * for the edit files modal.
             */ }
          <Button className="btn--edit" onClick={ () => { console.log( 'edit pressed' ); } } size="small" basic>Edit</Button>
        </h2>
        <ButtonAddFiles accept=".doc, .docx" onChange={ () => {} } multiple>+ Add Files</ButtonAddFiles>
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
