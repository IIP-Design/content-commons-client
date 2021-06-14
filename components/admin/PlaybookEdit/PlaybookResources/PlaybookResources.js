import { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { useQuery } from '@apollo/client';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import FileList from 'components/admin/FileList/FileList';

import { buildSupportFile } from 'lib/graphql/builders/common';
import { LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import { useFileUpload } from 'lib/hooks/useFileUpload';

import styles from './PlaybookResources.module.scss';

const PlaybookResources = ( { assetPath, files, projectId, updateMutation } ) => {
  const [temp, setTemp] = useState( [] );
  const [remove, removeTemp] = useState( null );
  const { uploadFile } = useFileUpload();

  useEffect( () => {
    if ( remove ) {
      const filtered = temp.filter( f => f.input.name !== remove );

      setTemp( filtered );
    }
  }, [remove] );

  // Get the English language data, needed when adding supportFiles.
  const { data: languageData } = useQuery( LANGUAGE_BY_NAME_QUERY, {
    variables: { displayName: 'English' },
  } );

  /**
   * Iterates of a provided list of files, uploading each to S3 and initiating the callback function to save the file connect in GraphQL.
   * If error occurs during upload, it sets and 'error' prop on the file object
   * @param {string} id project id
   * @param {array} fileList files to save
   * @param {string} savePath path to S3 directory to save
   * @param {func} saveFn save function
   * @param {func} progress progress callback function
   * @return {Promise}
   */
  const uploadAndSaveFiles = ( id, fileList, savePath, saveFn, progress ) => Promise.all(
    fileList.map( async file => {
      const _file = await uploadFile( savePath, file, progress );

      removeTemp( file?.input?.name );

      if ( _file.error ) {
        return Promise.resolve( { ...file, error: true } );
      }

      return saveFn( id, _file );
    } ),
  );

  /**
   * Save a support file's data to GraphQL.
   * @param {string} id project id
   * @param {object} file file to save
   * @return {Promise}
   */
  const saveSupportFile = async ( id, file ) => {
    const _file = { ...file };

    _file.language = languageData.languages[0].id;
    _file.visibility = 'INTERNAL';
    _file.editable = false;

    return updateMutation( {
      variables: {
        data: {
          supportFiles: {
            create: [buildSupportFile( _file )],
          },
        },
        where: { id },
      },
    } );
  };

  /**
   * Handles the file uploads, generating an array of files and passing it to the upload function.
   * @param {Event} e A React synthetic file upload event.
   */
  const addFiles = async e => {
    const fileList = Array.from( e.target.files ).map( file => ( { input: file } ) );

    setTemp( fileList );

    await uploadAndSaveFiles(
      projectId,
      fileList,
      assetPath,
      saveSupportFile,
    );
  };

  /**
   * Disconnects the given support file from the current playbook.
   * @param {string} id The id of the file to be disconnected from the playbook.
   * @returns {Object} The updated playbook data.
   */
  const onRemove = id => updateMutation( {
    variables: {
      data: {
        supportFiles: {
          'delete': { id },
        },
      },
      where: { id: projectId },
    },
  } );

  return (
    <section aria-label="Available Resources" className={ styles.container }>
      <h2 className={ styles['section-title'] }>Available Resources</h2>
      <span>Upload Files</span>

      <div className={ styles.instructions }>
        <p>
          Upload files specific to this Playbook that are not available on Commons.
        </p>
        <p>
          These files will not appear in any Commons search results.
        </p>
      </div>

      { files && files.length > 0 && (
        <div className={ styles.files }>
          <strong>{ `Files Uploaded (${files.length})` }</strong>
          <FileList files={ files } projectId={ projectId } onRemove={ onRemove } />
        </div>
      ) }

      { temp && temp.length > 0 && (
        <ul className={ `${styles.files} ${styles.placeholders}` }>
          { temp.map( file => (
            <li key={ `temp-${file?.input?.name}` } className={ styles.placeholder } />
          ) ) }
        </ul>
      ) }

      <ButtonAddFiles
        accept=".docx, .pdf"
        aria-label="Add files"
        multiple
        onChange={ addFiles }
      >
        + Add Files
      </ButtonAddFiles>
    </section>
  );
};

PlaybookResources.propTypes = {
  assetPath: PropTypes.string,
  files: PropTypes.array,
  projectId: PropTypes.string,
  updateMutation: PropTypes.func,
};

export default PlaybookResources;
