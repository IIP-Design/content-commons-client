import React from 'react';
import PropTypes from 'prop-types';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import FormInstructions from 'components/admin/FormInstructions/FormInstructions';
import UploadSuccessMsg from 'components/admin/UploadSuccessMsg/UploadSuccessMsg';
import './UploadProgress.scss';

const UploadProgress = props => {
  const {
    className,
    projectId,
    filesToUpload,
    displayTheUploadSuccessMsg,
    isUploading
  } = props;

  return (
    <div className={ `upload-progress-status ${className}` }>
      { !projectId && !isUploading && <FormInstructions /> }
      { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

      { isUploading
        && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            label="Please keep this page open until upload is complete"
            fileProgressMessage
          />
        ) }
    </div>
  );
};

UploadProgress.propTypes = {
  className: PropTypes.string,
  projectId: PropTypes.string,
  filesToUpload: PropTypes.array,
  displayTheUploadSuccessMsg: PropTypes.bool,
  isUploading: PropTypes.bool
};

export default UploadProgress;
