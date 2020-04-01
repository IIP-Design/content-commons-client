import React, { useState } from 'react';
import PropTypes from 'prop-types';
import dynamic from 'next/dynamic';
import { Button } from 'semantic-ui-react';
import { getCount, getPluralStringOrNot } from 'lib/utils';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import useToggleModal from 'lib/hooks/useToggleModal';
import { useCrudActionsDocument } from 'lib/hooks/useCrudActionsDocument';
import './PackageFiles.scss';

const PressPackageFile = dynamic( () => import( /* webpackChunkName: "pressPackageFile" */ 'components/admin/PackageEdit/PackageFiles/PressPackageFile/PressPackageFile' ) );

const PackageFiles = props => {
  const { pkg, hasInitialUploadCompleted } = props;

  const [progress, setProgress] = useState( 0 );

  const { saveFiles } = useCrudActionsDocument( {
    pollQuery: PACKAGE_QUERY,
    variables: { id: pkg.id }
  } );

  const { modalOpen, handleOpenModel, handleCloseModal } = useToggleModal();

  if ( !hasInitialUploadCompleted || !pkg || !getCount( pkg ) ) return null;

  const units = pkg.documents || [];

  const handleUploadProgress = ( progressEvent, file ) => {
    file.loaded = progressEvent.loaded;
    setProgress( progressEvent.loaded );
  };

  /**
   * Save/Delete files from edit modal
   * @param {array} filesToSave
   * @param {array} filesToRemove
   */
  const handleSave = async ( toSave, toRemove ) => {
    const files = { toSave, toRemove };
    saveFiles( pkg, files, handleUploadProgress );
  };

  return (
    <section className="edit-package__files package-files">
      <div className="heading">
        <div className="heading-group">
          <h3 className="headline uppercase">
            { `Uploaded ${getPluralStringOrNot( units, 'File' )} (${getCount( units )})` }
          </h3>
          <EditPackageFiles
            filesToEdit={ units }
            extensions={ ['.doc', '.docx'] }
            trigger={ (
              <Button className="btn--edit" onClick={ handleOpenModel } size="small" basic>
                Edit
              </Button>
            ) }
            title="Edit Package Files"
            modalOpen={ modalOpen }
            onClose={ handleCloseModal }
            save={ handleSave }
            progress={ progress } // use here to re-render modal
          />
        </div>
      </div>

      { !units.length && (
        <p style={ { marginTop: '1em', maxWidth: '55ch' } }>
          This package does not have any uploaded files. Please upload at least one file to publish this package to Content Commons.
        </p>
      ) }

      <div className="files">

        { units.map( unit => {
          /**
           * Future: conditionally render `<PressPackageFile />`
           * or some other type of package file, e.g.,
           * `<FrontOfficePackageFile />`
           */
          if ( pkg.type === 'DAILY_GUIDANCE' ) {
            return <PressPackageFile key={ unit.id } document={ unit } />;
          }
          return null;
          // return <SomeOtherPackageFile key={ unit.id } id={ unit.id } />;
        } ) }
      </div>
    </section>
  );
};

PackageFiles.propTypes = {
  pkg: PropTypes.object,
  hasInitialUploadCompleted: PropTypes.bool
};

export default PackageFiles;
