import React, { Fragment, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { Progress } from 'semantic-ui-react';
import './FileUploadProgressBar.scss';

/**
 * Uses total filesize of all files as opposed to total num of files to provide smoother progress
 * @param {object} props
 */
const FileUploadProgressBar = props => {
  const {
    filesToUpload, fileProgessMessage, onComplete, label, labelAlign, showPercent, barSize
  } = props;


  const size = filesToUpload.reduce( ( acc, curr ) => acc + curr.input.size, 0 );
  const uploadCount = filesToUpload.length;

  const [uploadCompleted, setUploadCompleted] = useState( -1 );
  const [numCompleted, setNumCompleted] = useState( 0 );

  const percentComplete = () => `${Math.round( ( uploadCompleted / size ) * 100 )}%`;

  useEffect( () => {
    const loaded = filesToUpload.reduce( ( acc, curr ) => acc + curr.loaded, 0 );
    const completed = filesToUpload.filter( file => file.loaded === file.input.size );

    setUploadCompleted( loaded );
    setNumCompleted( completed.length );
  }, [filesToUpload] );

  useEffect( () => {
    if ( ( uploadCount ) === numCompleted ) {
      if ( onComplete ) {
        onComplete();
      }
    }
  }, [numCompleted] );


  const renderFileOnProgress = () => {
    if ( numCompleted === uploadCount ) {
      return <b>Saving file metadata</b>;
    }
    return <div><b>Uploading files:</b> { numCompleted + 1 } of { uploadCount }</div>;
  };

  const renderLabel = () => {
    if ( !fileProgessMessage ) {
      return label;
    }
    return (
      <Fragment>
        { renderFileOnProgress() }
        <div>{ label }</div>
      </Fragment>

    );
  };

  return (
    <div className="file-progress--wrapper">
      <Progress
        value={ uploadCompleted }
        total={ size }
        color="blue"
        size={ barSize }
        active
      ><div className={ `file-progress--label ${labelAlign}` }>{ label && renderLabel() }</div>
      </Progress>
      { showPercent && (
      <span>{ percentComplete() }</span>
      ) }

    </div>
  );
};

FileUploadProgressBar.defaultProps = {
  barSize: 'medium',
  showPercent: false,
  labelAlign: 'center'
};

FileUploadProgressBar.propTypes = {
  filesToUpload: PropTypes.array,
  fileProgessMessage: PropTypes.bool,
  showPercent: PropTypes.bool,
  label: PropTypes.string,
  labelAlign: PropTypes.string,
  barSize: PropTypes.string,
  onComplete: PropTypes.func,
};

export default FileUploadProgressBar;
