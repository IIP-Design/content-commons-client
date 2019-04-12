import React, { useEffect, Fragment } from 'react';
import PropTypes from 'prop-types';
import VideoProjectFilesDesktop from './VideoProjectFileDesktop/VideoProjectFileDesktop';
import VideoProjectFilesMobile from './VideoProjectFilesMobile/VideoProjectFilesMobile';
import { VideoUploadContext } from '../VideoUpload';
import './VideoProjectFiles.scss';

const VideoProjectFiles = props => {
  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal prepare-files-active' );
    return () => {
      props.updateModalClassname( 'upload_modal' );
    };
  }, [] );


  return (
    <VideoUploadContext.Consumer>
      { context => {
        const message = context.files.length
          ? `Preparing ${context.files.length} files for upload...`
          : 'Please add files to upload';

        return (
          <Fragment>
            <h5 className="videoProjectFiles__headline">{ message }</h5>
            <VideoProjectFilesDesktop />
            <VideoProjectFilesMobile />
          </Fragment>
        );
      } }
    </VideoUploadContext.Consumer>
  );
};


VideoProjectFiles.propTypes = {
  updateModalClassname: PropTypes.func
};

export default VideoProjectFiles;
