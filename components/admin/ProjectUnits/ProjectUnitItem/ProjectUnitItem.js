import React, {
  useState, useEffect, useContext
} from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { getCount } from 'lib/utils';
import truncate from 'lodash/truncate';
import {
  Card, Modal, Image, List, Loader
} from 'semantic-ui-react';
import iconVideoCamera from 'static/icons/icon_32px_videoCamera.png';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import GeneralError from 'components/errors/GeneralError/GeneralError';
import { UploadContext } from '../../ProjectEdit/VideoEdit/UploadContext';
import './ProjectUnitItem.scss';

const EditSingleProjectItem = dynamic( () => import( /* webpackChunkName: "editSingleProjectItem" */ 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem' ) );

const ProjectUnitItem = props => {
  const {
    projectId, unit, filesToUpload,
  } = props;
  const [unitUploadComplete, setUnitUploadComplete] = useState( false );
  const [error, setError] = useState( false );

  // do not put in state as it will create a new object and will not track upload
  // need a better solution as this is prone to errors
  const unitFileToUpload = filesToUpload.filter( file => file.language === unit.language.id );

  const uploadInProgress = useContext( UploadContext );

  const getFileStream = ( file = {}, site = 'vimeo' ) => {
    if ( file.stream && Array.isArray( file.stream ) ) {
      return file.stream.find( stream => stream.site === site );
    }
    return {};
  };

  const hasError = () => {
    if ( unit && Array.isArray( unit.files ) ) {
      return unit.files.some( file => {
        const stream = getFileStream( file );
        if ( file.error ) {
          return file.error;
        }
        return getCount( stream ) && !stream.url;
      } );
    }
    return false;
  };

  const handleOnComplete = () => {
    setUnitUploadComplete( true );
  };


  useEffect( () => {
    setError( hasError() );
  }, [projectId] );


  const renderThumbnail = () => {
    if ( unit ) {
      const { thumbnails } = unit;
      if ( thumbnails && thumbnails[0] && thumbnails[0].image ) {
        return (
          <Image src={ thumbnails[0].image.signedUrl } fluid />
        );
      }
    }
    return <div className="placeholder" />;
  };

  const renderProjectItem = () => (
    <Card className="project-unit-item">
      <div className="image-wrapper">
        { renderThumbnail() }

        { /* Has an upload been triggered and if so, are the files applicable to this unit complete? */ }
        { uploadInProgress && !unitUploadComplete && ( <Loader active size="small" /> ) }

        { /* Remove file overlay if above conditions are met */ }
        { !!unitFileToUpload.length && !unitUploadComplete && (
          <List className="file-list">
            { unitFileToUpload.map( file => <List.Item key={ file.id }>{ truncate( file.input.name, { length: 45 } ) }</List.Item> ) }
          </List>
        ) }

        { !error
          && <img className="metaicon" src={ iconVideoCamera } alt="Video Icon" /> }
      </div>

      { /* Remove progress bar if above conditions are met */ }
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
      <Card.Content className={ error ? 'error' : '' } lang={ unit.language?.languageCode || 'en' }>
        <Card.Header>{ unit && unit.title ? unit.title : '[Title]' }</Card.Header>
        <Card.Meta>
          <List>
            <List.Item>Language: { unit.language.displayName }</List.Item>
            <List.Item>Files: { unit.files.length }</List.Item>
            { error
              && (
                <List.Item>
                  <GeneralError msg="Uploading Error" />
                </List.Item>
              ) }
          </List>
        </Card.Meta>
      </Card.Content>
    </Card>
  );

  if ( projectId && !error ) {
    return (
      <Modal
        key={ unit.language.id }
        trigger={ renderProjectItem() }
        closeIcon
      >
        <Modal.Content>
          <EditSingleProjectItem
            projectId={ projectId }
            itemId={ unit.id }
          />
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
