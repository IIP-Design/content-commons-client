import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useRouter } from 'next/router';
import { useMutation } from '@apollo/client';
import { useFormikContext } from 'formik';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';

import { getCount, getPluralStringOrNot } from 'lib/utils';
import { useFileUpload } from 'lib/hooks/useFileUpload';
import useToggleModal from 'lib/hooks/useToggleModal';

import { buildCreateDocument } from 'lib/graphql/builders/document';
import { buildCreatePlaybookTree } from 'lib/graphql/builders/playbook';
import { buildCreatePackageTree } from 'lib/graphql/builders/package';
import { CREATE_PLAYBOOK_MUTATION } from 'lib/graphql/queries/playbook';
import {
  CREATE_PACKAGE_MUTATION,
  PACKAGE_EXISTS_QUERY,
  UPDATE_PACKAGE_MUTATION,
} from 'lib/graphql/queries/package';

import styles from './ButtonPackageCreate.module.scss';

const ButtonPackageCreate = ( { user, setError } ) => {
  const [files, setFiles] = useState( [] );
  const [progress, setProgress] = useState( 0 );
  const [pkg, setPkg] = useState( null );
  const { values, isValid } = useFormikContext();

  const router = useRouter();
  const { modalOpen, handleOpenModel, handleCloseModal } = useToggleModal();
  const { uploadFile } = useFileUpload();

  const [updatePackage] = useMutation( UPDATE_PACKAGE_MUTATION );
  const [createPlaybook] = useMutation( CREATE_PLAYBOOK_MUTATION );
  const [createPackage] = useMutation( CREATE_PACKAGE_MUTATION );
  const [packageExists] = useMutation( PACKAGE_EXISTS_QUERY );

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

  /**
   * Checks whether a package exists with the supplied field name and values
   * @param {object} where clause containing fields to test existence against, i.e. { title: Daily Guidance }
   * @returns bool
   */
  const doesPackageExist = async where => {
    const res = await packageExists( {
      variables: {
        where,
      },
    } );

    return res.data.packageExists;
  };

  /**
   * Convenience func to execute graphql create mutations
   * @param {func} creator create mutation
   * @param {func} builder func to transform form values to applicable package type format
   * @param {object} values form values
   * @returns Promise
   */
  const executeCreate = async ( creator, builder, vals ) => creator( {
    variables: {
      data: builder( vals ),
    },
  } );

  /**
  * Create guidance package and send user to
  * package edit screen on success.
  * @returns void
  */
  const createGuidancePackage = async vals => {
    const { title, desc } = vals;
    const _values = {
      title,
      desc,
      type: 'DAILY_GUIDANCE',
      userId: user.id,
      teamId: user.team.id,
    };

    if ( await doesPackageExist( { title } ) ) {
      setError( `A Guidance Package with the name "${title}" already exists.` );

      return;
    }

    try {
      const res = await executeCreate( createPackage, buildCreatePackageTree, _values );

      setPkg( res.data.createPackage );

      return res.data.createPackage;
    } catch ( err ) {
      setError( err );
    }
  };

  /**
  * Create playbook package and send user to
  * playbook edit screen on success.
  * @returns void
  */
  const createPlaybookPackage = async vals => {
    const _values = { ...vals };

    // Remove values
    delete _values.visibility;
    delete _values.termsConditions;

    _values.userId = user.id;
    _values.teamId = user.team.id;

    try {
      const res = await executeCreate( createPlaybook, buildCreatePlaybookTree, _values );

      router.push( `/admin/package/playbook/${res.data.createPlaybook.id}` );
    } catch ( err ) {
      setError( err );
    }
  };

  const _createPackage = async e => {
    const fileList = Array.from( e.target.files );
    const _pkg = await createGuidancePackage( values );

    if ( _pkg?.id ) {
      handleAddFiles( fileList );
    }
  };

  return ( ( values.type === 'PACKAGE' || values.type === 'DAILY_GUIDANCE' )
    ? (
      <EditPackageFiles
        filesToEdit={ files }
        extensions={ ['.doc', '.docx'] }
        trigger={ (
          <ButtonAddFiles
            accept=".doc, .docx"
            onChange={ _createPackage }
            disabled={ !isValid }
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
        disabled={ !isValid }
        className={ styles['btn-submit'] }
        onClick={ () => createPlaybookPackage( values ) }
      >
        Save draft & continue
      </button>
    ) );
};

ButtonPackageCreate.propTypes = {
  user: PropTypes.object,
  setError: PropTypes.func,
};

export default ButtonPackageCreate;
