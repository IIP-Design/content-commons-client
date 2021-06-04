import PropTypes from 'prop-types';
import { useMutation, useQuery } from '@apollo/client';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import FileList from 'components/admin/FileList/FileList';

import { buildSupportFile } from 'lib/graphql/builders/common';
import { useFileUpload } from 'lib/hooks/useFileUpload';
import { PLAYBOOK_QUERY } from 'lib/graphql/queries/playbook';
import { LANGUAGE_BY_NAME_QUERY } from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';

import styles from './PlaybookResources.module.scss';

const PlaybookResources = ( { assetPath, projectId, updateMutation } ) => {
  const { uploadFile } = useFileUpload();

  /**
   * Get the English language data.
   */
  const { data: languageData } = useQuery( LANGUAGE_BY_NAME_QUERY, {
    variables: { displayName: 'English' },
  } );

  /**
   * Uploads and saves files. If error occurs, set 'error' prop on file object
   * @param {string} id project id
   * @param {array} files files to save
   * @param {string} savePath path to S3 directory to save
   * @param {func} saveFn save function
   * @param {func} progress progress callback function
   * @return {Promise}
   */
  const uploadAndSaveFiles = ( id, files, savePath, saveFn, progress ) => Promise.all(
    files.map( async file => {
      const _file = await uploadFile( savePath, file, progress );

      if ( _file.error ) {
        return Promise.resolve( { ...file, error: true } );
      }

      return saveFn( id, _file );
    } ),
  );

  /**
   * Save support file.
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

  /** This portion simulates the data returned from a file upload, should be replaced with an actual support file mutation */
  const addFiles = async e => {
    const fileList = Array.from( e.target.files ).map( file => ( { input: file } ) );

    await uploadAndSaveFiles(
      projectId,
      fileList,
      assetPath,
      saveSupportFile,
    );
  };

  const onRemove = id => {
    // const updated = files.filter( file => file.id !== id );

    // setFiles( updated );
  };
  /** End simulated portion */

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

      { /* { files && files.length > 0 && (
        <div className={ styles.files }>
          <strong>{ `Files Uploaded (${files.length})` }</strong>
          <FileList files={ files } projectId={ projectId } onRemove={ onRemove } />
        </div>
      ) } */ }

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
  projectId: PropTypes.string,
  updateMutation: PropTypes.func,
};

export default PlaybookResources;
