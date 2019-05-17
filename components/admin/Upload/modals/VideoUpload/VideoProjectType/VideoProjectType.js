import React, { useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './VideoProjectType.scss';
import { UploadFilesContext } from '../../../UploadFilesContext';

const VideoProjectType = props => {
  console.log( 'rendering VideoProjectType' );

  const { addFiles } = useContext( UploadFilesContext );

  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  // @todo this renders twice3, fix
  useEffect( () => {
    props.updateModalClassname( 'upload_modal project-type-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );


  // only called if files are selected
  const handleOnChangeFiles = e => {
    addFiles( e.target.files );
    props.goNext();
  };

  return (
    <Form>
      <strong>Upload Files to create a new video project</strong>
      <p>A video project consists of at least one video file, optional translations of the video, and any support files associated with it.</p>
      <p>Acceptable file types include .mp4 and .mov, .srt, and .jpg or .png files that may be used for thumbnails.</p>
      <div className="upload_actions">
        <Button
          type="button"
          onClick={ props.closeModal }
          className="secondary"
        >Cancel
        </Button>
        <ButtonAddFiles onChange={ handleOnChangeFiles } multiple>+ Add Files</ButtonAddFiles>
      </div>
    </Form>

  );
};

VideoProjectType.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  goNext: PropTypes.func
};

export default VideoProjectType;
