import React from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';

/**
 * Uses total filesize of all files as opposed to total num of files to provide smoother progress
 * @param {object} props
 */
const FileUploadProgressBar = props => (
  <Progress
    value={ props.completed }
    total={ props.total }
    color="blue"
    size="medium"
    active
  >
    <p>
      {
        props.filesUploaded === props.filesToUploadCount
          ? <b>Saving file metadata</b>
          : <span><b>Uploading files:</b> { props.filesUploaded + 1 } of { props.filesToUploadCount }</span>
      }
      <br />
      Please keep this page open until upload is complete
    </p>
  </Progress>
);

FileUploadProgressBar.propTypes = {
  total: PropTypes.number,
  completed: PropTypes.number,
  filesUploaded: PropTypes.number,
  filesToUploadCount: PropTypes.number
};

export default FileUploadProgressBar;
