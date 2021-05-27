import React from 'react';
// import PropTypes from 'prop-types';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';

import styles from './PlaybookResources.module.scss';

const PlaybookResources = () => (
  <section aria-label="Available Resources" className={ styles.container }>
    <h2>Available Resources</h2>
    <span>Upload Files</span>

    <div className={ styles.instructions }>
      <p>
        Upload files specific to this Playbook that are not available on Commons.
      </p>
      <p>
        These files will not appear in any Commons search results.
      </p>
    </div>

    <ButtonAddFiles
      accept=".docx, .pdf"
      aria-label="Add files"
      multiple
    >
      + Add Files
    </ButtonAddFiles>
  </section>
);

// PlaybookResources.propTypes = {};

export default PlaybookResources;
