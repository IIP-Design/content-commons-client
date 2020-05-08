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
    filesToUpload, fileProgressMessage, onComplete, label, labelAlign, showPercent, barSize, customStyles
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
    if ( uploadCount === numCompleted ) {
      if ( onComplete ) {
        onComplete();
      }
    }
  }, [numCompleted] );


  const renderFileOnProgress = () => {
    if ( numCompleted === uploadCount ) {
      return <b>Saving file metadata</b>;
    }

    return <div style={ { marginTop: '2px' } }><b>Uploading files:</b> { numCompleted + 1 } of { uploadCount }</div>;
  };

  const renderLabel = () => (
    <Fragment>
      { fileProgressMessage && renderFileOnProgress() }
      <div style={ { marginTop: '5px' } }>{ label }</div>
    </Fragment>

  );

  return (
    <div className="file-progress--wrapper" style={ customStyles }>
      <Progress
        value={ uploadCompleted }
        total={ size }
        color="blue"
        size={ barSize }
        active
      >
        { label && <div className={ `file-progress--label ${labelAlign}` }>{ renderLabel() }</div> }
      </Progress>
      { showPercent && <span>{ percentComplete() }</span> }
    </div>
  );
};

FileUploadProgressBar.defaultProps = {
  barSize: 'medium',
  showPercent: false,
  labelAlign: 'center',
  fileProgressMessage: false
};

FileUploadProgressBar.propTypes = {
  filesToUpload: PropTypes.array,
  fileProgressMessage: PropTypes.bool,
  showPercent: PropTypes.bool,
  label: PropTypes.string,
  labelAlign: PropTypes.string,
  barSize: PropTypes.string,
  onComplete: PropTypes.func,
  customStyles: PropTypes.object
};

export default FileUploadProgressBar;
