import React, { useContext } from 'react';
import PropTypes from 'prop-types';
import {
  Form,
  Button
} from 'semantic-ui-react';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../../CancelUpload/CancelUpload';
import VideoProjectFilesRowMobile from './VideoProjectFilesRowMobile';
import './VideoProjectFilesMobile.scss';
import { UploadFilesContext } from '../../../../UploadFilesContext';

const VideoProjectFilesMobile = props => {
  console.log( 'rendering VideoProjectFilesMobile' );

  const { files, addFiles, complete } = useContext( UploadFilesContext );
  const { addFilesToUpload, closeModal } = props;

  const handleAddFilesToUpload = () => {
    addFilesToUpload( files );
  };

  return (
    <div className="videoProjectFilesMobile__wrapper">
      <Form>

        { files.map( file => (
          <VideoProjectFilesRowMobile
            key={ file.id }
            file={ file }
          />
        ) ) }

        <ButtonAddFiles onChange={ e => addFiles( e.target.files ) } multiple className="secondary">+ Add Files</ButtonAddFiles>

        <Form.Field className="upload_actions">
          <CancelUpload closeModal={ closeModal } />
          <Button
            className="primary"
            content="Continue"
            disabled={ !complete }
            onClick={ handleAddFilesToUpload }
          />

        </Form.Field>
      </Form>
    </div>
  );
};

VideoProjectFilesMobile.propTypes = {
  addFilesToUpload: PropTypes.func,
  closeModal: PropTypes.func
};


export default VideoProjectFilesMobile;
