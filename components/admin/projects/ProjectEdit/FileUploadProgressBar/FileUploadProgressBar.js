import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';

/**
 * Uses total filesize of all files as opposed to total num of files to provide smoother progress
 * @param {object} props
 */
const FileUploadProgressBar = props => {
  const {
    filesToUpload, showMessage
  } = props;

  const size = filesToUpload.reduce( ( acc, curr ) => acc + curr.input.size, 0 );
  const uploadCount = filesToUpload.length;

  const [uploadCompleted, setUploadCompleted] = useState( 0 );
  const [numCompleted, setNumCompleted] = useState( 0 );

  useEffect( () => {
    const loaded = filesToUpload.reduce( ( acc, curr ) => acc + curr.loaded, 0 );
    const completed = filesToUpload.filter( file => file.loaded === file.input.size );

    setUploadCompleted( loaded );
    setNumCompleted( completed.length );
  }, [filesToUpload] );

  return (
    <Progress
      value={ uploadCompleted }
      total={ size }
      color="blue"
      size="medium"
      active
    >
      { showMessage && (
        <p>
          {
          numCompleted === uploadCount
            ? <b>Saving file metadata</b>
            : <span><b>Uploading files:</b> { numCompleted + 1 } of { uploadCount }</span>
          }
          <br />
          Please keep this page open until upload is complete
        </p>
      ) }
    </Progress>

  );
};

FileUploadProgressBar.propTypes = {
  filesToUpload: PropTypes.array,
  showMessage: PropTypes.bool
};

export default FileUploadProgressBar;
