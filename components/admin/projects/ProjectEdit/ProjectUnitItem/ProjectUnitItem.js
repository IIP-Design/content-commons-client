import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import {
  Card, Modal, Image, Loader
} from 'semantic-ui-react';
import FileUploadProgressBar from 'components/admin/projects/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
import { UploadContext } from '../VideoEdit/VideoEdit';


const ProjectUnitItem = props => {
  const { publicRuntimeConfig } = getConfig();
  const { unit, filesToUpload } = props;

  const PLACEHOLDER = '/static/images/thumbnail_video.jpg';
  const S3_PATH = `https://s3.amazonaws.com/${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET}`;

  const [hasFilesToUpload, setHasFilesToUpload] = useState( false );
  const [thumbnail, setThumbnail] = useState( PLACEHOLDER );
  const [title, setTitle] = useState( '' );

  const uploadInProgress = useContext( UploadContext );

  const getThumbnail = u => {
    if ( u && u.thumbnails && u.thumbnails[0] && u.thumbnails[0].image ) {
      return `${S3_PATH}/${u.thumbnails[0].image.url}`;
    }
    return PLACEHOLDER;
  };

  useEffect( () => {
    setThumbnail( getThumbnail( unit ) );
    setTitle( unit && unit.title ? unit.title : '[Title]' );
  }, [unit] );

  useEffect( () => {
    if ( unit && unit.files ) {
      setHasFilesToUpload( unit.files.some( file => !!file.input ) );
    }
  }, [] );


  const unitFileToUpload = filesToUpload.filter( file => file.language === unit.language.id );

  return (
    <Modal
      key={ unit.language.id }
      trigger={ (
        <Card>
          <Image src={ thumbnail } />
          <Card.Content>
            <Card.Header>{ `${title} | ${unit.language.displayName}` }</Card.Header>
            <Card.Meta>{ `Files: ${unit.files.length}` }</Card.Meta>
          </Card.Content>

          { uploadInProgress && hasFilesToUpload && (
            <FileUploadProgressBar
              filesToUpload={ unitFileToUpload }
              showMessage={ false }
            />
          ) }

        </Card>
      ) }
    >
      <Modal.Content>
        <div>Content</div>
      </Modal.Content>
    </Modal>
  );
};

ProjectUnitItem.propTypes = {
  unit: PropTypes.object,
  filesToUpload: PropTypes.array
};


export default ProjectUnitItem;
