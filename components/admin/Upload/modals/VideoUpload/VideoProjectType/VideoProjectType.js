import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Form, Button, Modal } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import IncludeVideoFileMsg from '../../IncludeVideoFileMsg/IncludeVideoFileMsg';
import './VideoProjectType.scss';


const VideoProjectType = props => {
  const [includeVideoFileMsg, setIncludeVideoFileMsg] = useState( false );

  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal project-type-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );


  // only called if files are selected
  const handleOnChangeFiles = e => {
    const { files } = e.target;
    const fileTypes = Array.from( files ).map( file => file.type );
    const includesVideoFile = fileTypes.includes('video/mp4') || fileTypes.includes('video/quicktime');

    if ( !includesVideoFile ) {
      return setIncludeVideoFileMsg( true );
    }

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
          className="secondary"
        >Cancel
        </Button>
        <ButtonAddFiles onChange={ handleOnChangeFiles } multiple>+ Add Files</ButtonAddFiles>
      </div>
      <IncludeVideoFileMsg
        includeVideoFileMsg={ includeVideoFileMsg }
        setIncludeVideoFileMsg={ setIncludeVideoFileMsg }
      />
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
