import React, { useEffect, useContext, Fragment } from 'react';
import PropTypes from 'prop-types';
import VideoProjectFilesDesktop from './VideoProjectFileDesktop/VideoProjectFileDesktop';
import VideoProjectFilesMobile from './VideoProjectFilesMobile/VideoProjectFilesMobile';
import './VideoProjectFiles.scss';
import { UploadFilesContext } from '../../../UploadFilesContext';

const VideoProjectFiles = props => {
  console.log( 'rendering VideoProjectFiles' );

  const { files } = useContext( UploadFilesContext );
  const { addFilesToUpload, closeModal } = props;


  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  // @todo this renders twice, fix
  useEffect( () => {
    props.updateModalClassname( 'upload_modal prepare-files-active' );
    return () => {
      props.updateModalClassname( 'upload_modal' );
    };
  }, [] );

  const message = files.length
    ? `Preparing ${files.length} files for upload...`
    : 'Please add files to upload';

  return (
    <Fragment>
      <h5 className="videoProjectFiles__headline">{ message }</h5>
      <VideoProjectFilesDesktop addFilesToUpload={ addFilesToUpload } closeModal={ closeModal } />
      <VideoProjectFilesMobile addFilesToUpload={ addFilesToUpload } closeModal={ closeModal } />
    </Fragment>
  );
};


VideoProjectFiles.propTypes = {
  updateModalClassname: PropTypes.func,
  addFilesToUpload: PropTypes.func,
  closeModal: PropTypes.func
};

export default VideoProjectFiles;
