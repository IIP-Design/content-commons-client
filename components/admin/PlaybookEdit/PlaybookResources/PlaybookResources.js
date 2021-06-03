import { useState } from 'react';
import PropTypes from 'prop-types';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import FileList from 'components/admin/FileList/FileList';

import styles from './PlaybookResources.module.scss';

const PlaybookResources = ( { projectId } ) => {
  const [files, setFiles] = useState( [] );

  /** This portion simulates the data returned from a file upload, should be replaced with an actual support file mutation */
  const addFiles = e => {
    const fileList = Array.from( e.target.files );

    const supportFiles = fileList.map( file => ( {
      id: file.name,
      filename: file.name,
      input: {},
    } ) );

    setFiles( supportFiles );
  };

  const onRemove = id => {
    const updated = files.filter( file => file.id !== id );

    setFiles( updated );
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

      { files && files.length > 0 && (
        <div className={ styles.files }>
          <strong>{ `Files Uploaded (${files.length})` }</strong>
          <FileList files={ files } projectId={ projectId } onRemove={ onRemove } />
        </div>
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
  projectId: PropTypes.string,
};

export default PlaybookResources;
