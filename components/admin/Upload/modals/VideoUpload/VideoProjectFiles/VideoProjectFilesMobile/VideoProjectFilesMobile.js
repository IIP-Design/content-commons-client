import React from 'react';
import {
  Form,
  Button
} from 'semantic-ui-react';

import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import CancelUpload from '../../../CancelUpload/CancelUpload';
import VideoProjectFilesRowMobile from './VideoProjectFilesRowMobile';
import { VideoUploadContext } from '../../VideoUpload';
import './VideoProjectFilesMobile.scss';

const VideoProjectFilesMobile = () => (
  // Context API is used to avoind having to pass props down multiple levels
  <VideoUploadContext.Consumer>
    { ( {
      files, addAssetFiles, closeModal, allFieldsSelected, handleAddFilesToUpload
    } ) => (
      <div className="videoProjectFilesMobile__wrapper">
        <Form>

          { files.map( file => (
            <VideoProjectFilesRowMobile
              key={ file.id }
              file={ file }
            />
          ) ) }

          <ButtonAddFiles onChange={ e => addAssetFiles( e.target.files ) } multiple className="secondary">+ Add Files</ButtonAddFiles>

          <Form.Field className="upload_actions">
            <CancelUpload closeModal={ closeModal } />
            <Button
              className="primary"
              content="Next"
              disabled={ !allFieldsSelected }
              onClick={ handleAddFilesToUpload }
            />

          </Form.Field>
        </Form>
      </div>
    )
      }
  </VideoUploadContext.Consumer>
);


export default VideoProjectFilesMobile;
