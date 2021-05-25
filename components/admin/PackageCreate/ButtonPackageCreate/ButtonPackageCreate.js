import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';

import { getCount, getPluralStringOrNot } from 'lib/utils';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';

import useToggleModal from 'lib/hooks/useToggleModal';
import { useFileUpload } from 'lib/hooks/useFileUpload';

import { buildCreateDocument } from 'lib/graphql/builders/document';
import { UPDATE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';

import styles from './ButtonPackageCreate.module.scss';


const ButtonPackageCreate = ( {
  pkg,
  formikProps,
  createGuidancePackage,
  createPlaybookPackage,
} ) => {
  const [files, setFiles] = useState( [] );
  const [progress, setProgress] = useState( 0 );

  const { modalOpen, handleOpenModel, handleCloseModal } = useToggleModal();
  const router = useRouter();
  const { uploadFile } = useFileUpload();

  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );

  const createFile = async ( { id, assetPath }, file, callback ) => {
    let _file;

    try {
      // upload file if File input exists
      if ( file.input ) {
        _file = await uploadFile( assetPath, file, callback );
      }

      updatePackage( {
        variables: {
          data: {
            assetPath,
            documents: {
              create: buildCreateDocument( _file ),
            },
          },
          where: { id },
        },
      } );
    } catch ( err ) {
      console.log( err );
    }
  };

  const handleUploadProgress = ( progressEvent, file ) => {
    file.loaded = progressEvent.loaded;
    setProgress( progressEvent.loaded );
  };

  const handleAddFiles = fileList => {
    setFiles( fileList );
    handleOpenModel();
  };

  /**
   * Save files from edit modal
   * @param {array} filesToSave
   */
  const handleSaveModalFiles = async filesToSave => {
    await Promise.all( filesToSave.map( async file => createFile( pkg, file, handleUploadProgress ) ) );

    router.push( `/admin/package/guidance/${pkg?.id}` );
  };

  const createPackage = async e => {
    const fileList = Array.from( e.target.files );
    const _pkg = await createGuidancePackage( formikProps.values );

    if ( _pkg?.id ) {
      handleAddFiles( fileList );
    }
  };

  return ( ( formikProps.values.type === 'DAILY_GUIDANCE' )
    ? (
      <EditPackageFiles
        filesToEdit={ files }
        extensions={ ['.doc', '.docx'] }
        trigger={ (
          <ButtonAddFiles
            accept=".doc, .docx"
            onChange={ createPackage }
            disabled={ !formikProps.isValid }
            fluid
            multiple
          >
            Save draft & upload files
          </ButtonAddFiles>
        ) }
        title={ `Preparing ${getCount( files )} ${getPluralStringOrNot(
          files,
          'file',
        )} for upload... ` }
        headerStyles={ { fontSize: '1em', marginBottom: '.8em' } }
        modalOpen={ modalOpen }
        onClose={ handleCloseModal }
        save={ handleSaveModalFiles }
        progress={ progress }
      />
    )
    : (
      <button
        type="button"
        disabled={ !formikProps.isValid }
        className={ styles['btn-submit'] }
        onClick={ () => createPlaybookPackage( formikProps.values ) }
      >
        Save draft & continue
      </button>
    ) );
};

ButtonPackageCreate.propTypes = {
  formikProps: PropTypes.object,
  pkg: PropTypes.object,
  createGuidancePackage: PropTypes.func,
  createPlaybookPackage: PropTypes.func,
};

export default ButtonPackageCreate;
