import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Form, Button } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import './VideoProjectType.scss';

const VideoProjectType = props => {
  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal project-type-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );


  // only called if files are selected
  const handleOnChangeFiles = e => {
    props.addAssetFiles( e.target.files );
    props.goNext();
  };

  return (
    <Form>
      <p>A video project consists of <strong>at least one video file</strong>, optional translations of the video, and any support files associated with it.</p>
      <p>Acceptable file types include .mp4 and .mov, .srt, and .jpg or .png files that may be used for thumbnails.</p>
      <div className="upload_actions">
        <Button
          type="button"
          onClick={ props.closeModal }
          className="secondary alternative"
        >Cancel
        </Button>
        <ButtonAddFiles onChange={ handleOnChangeFiles } multiple>Add Files</ButtonAddFiles>
      </div>
    </Form>
  );
};

VideoProjectType.propTypes = {
  closeModal: PropTypes.func,
  addAssetFiles: PropTypes.func,
  updateModalClassname: PropTypes.func,
  goNext: PropTypes.func
};

export default VideoProjectType;
