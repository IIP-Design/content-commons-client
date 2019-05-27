import React, {
  useState, useEffect, useContext, Fragment
} from 'react';
import PropTypes from 'prop-types';
import getConfig from 'next/config';
import truncate from 'lodash/truncate';
import {
  Card, Modal, Image, List, Loader
} from 'semantic-ui-react';
import FileUploadProgressBar from 'components/admin/projects/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
import { UploadContext } from '../VideoEdit/VideoEdit';
import './ProjectUnitItem.scss';

const ProjectUnitItem = props => {
  const { publicRuntimeConfig } = getConfig();
  const { projectId, unit, filesToUpload } = props;

  // const PLACEHOLDER = '/static/images/thumbnail_video.jpg';
  const PLACEHOLDER = null;
  const S3_PATH = `https://s3.amazonaws.com/${publicRuntimeConfig.REACT_APP_AWS_S3_PUBLISHER_UPLOAD_BUCKET}`;

  const [thumbnail, setThumbnail] = useState( PLACEHOLDER );
  const [title, setTitle] = useState( '' );
  const [unitUploadComplete, setUnitUploadComplete] = useState( false );

  // do not put in state
  const unitFileToUpload = filesToUpload.filter( file => file.language === unit.language.id );

  const uploadInProgress = useContext( UploadContext );

  const getThumbnail = u => {
    if ( u && u.thumbnails && u.thumbnails[0] && u.thumbnails[0].image ) {
      return `${S3_PATH}/${u.thumbnails[0].image.url}`;
    }
    // return PLACEHOLDER;
  };

  const handleOnComplete = () => {
    setUnitUploadComplete( true );
  };

  useEffect( () => {
    setThumbnail( getThumbnail( unit ) );
    setTitle( unit && unit.title ? unit.title : '[Title]' );
  }, [unit] );


  const renderProjectItem = () => (
    <Card className="project-unit-item">
      <div className="image-wrapper">
        { thumbnail
          ? ( <Image src={ thumbnail } fluid /> )
          : <div className="placeholder" />
        }
        { uploadInProgress && !unitUploadComplete && ( <Loader active size="small" /> ) }
        { !!unitFileToUpload.length && !unitUploadComplete && (
          <List className="file-list">
            { unitFileToUpload.map( file => <List.Item key={ file.id }>{ truncate( file.input.name, { length: 45 } ) }</List.Item> ) }
          </List>
        )
        }
      </div>
      { uploadInProgress && !unitUploadComplete && !!unitFileToUpload.length && (
        <FileUploadProgressBar
          filesToUpload={ unitFileToUpload }
          label="Upload in progress"
          labelAlign="left"
          barSize="tiny"
          onComplete={ handleOnComplete }
          showPercent
        />
      ) }
      <Card.Content>
        <Card.Header>{ title }</Card.Header>
        <Card.Meta>
          <List>
            <List.Item>Language: { unit.language.displayName }</List.Item>
            <List.Item>Files: { unit.files.length }</List.Item>
          </List>
        </Card.Meta>
      </Card.Content>

    </Card>
  );

  if ( projectId ) {
    return (
      <Modal
        key={ unit.language.id }
        trigger={ renderProjectItem() }
      >
        <Modal.Content>
          <div>Content</div>
        </Modal.Content>
      </Modal>
    );
  }

  // this is a new project, deactivate modal
  return renderProjectItem();
};

ProjectUnitItem.propTypes = {
  unit: PropTypes.object,
  filesToUpload: PropTypes.array,
  projectId: PropTypes.string
};


export default ProjectUnitItem;
