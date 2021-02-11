import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import FormInstructions from 'components/admin/FormInstructions/FormInstructions';
import UploadSuccessMsg from 'components/admin/UploadSuccessMsg/UploadSuccessMsg';
import useTimeout from 'lib/hooks/useTimeout';
import './UploadProgress.scss';

const UploadProgress = ( {
  className,
  projectId,
  filesToUpload,
  isUploading,
  uploadComplete,
  uploadCompleteDelay = 3000,
} ) => {
  const [complete, setComplete] = useState( false );
  const [initialized, setInitialized] = useState( false );

  useEffect( () => {
    if ( isUploading ) {
      setInitialized( true );
    }
  }, [isUploading] );

  const { startTimeout } = useTimeout( () => {
    setComplete( false );
  }, uploadCompleteDelay );

  const onUploadComplete = () => {
    setComplete( true );
    startTimeout();

    if ( uploadComplete && typeof uploadComplete === 'function' ) {
      uploadComplete();
    }
  };

  return (
    <div className={ `upload-progress-status ${className}` }>
      { !projectId && !initialized && !isUploading && <FormInstructions /> }
      { complete && !isUploading && <UploadSuccessMsg /> }

      { isUploading && (
        <FileUploadProgressBar
          filesToUpload={ filesToUpload }
          label="Please keep this page open until upload is complete"
          fileProgressMessage
          onComplete={ onUploadComplete }
        />
      ) }
    </div>
  );
};

UploadProgress.propTypes = {
  className: PropTypes.string,
  projectId: PropTypes.string,
  filesToUpload: PropTypes.array,
  isUploading: PropTypes.bool,
  uploadComplete: PropTypes.func,
  uploadCompleteDelay: PropTypes.number,
};

export default UploadProgress;
