import React, {
  useState, useEffect, useContext
} from 'react';
import dynamic from 'next/dynamic';
import PropTypes from 'prop-types';
import { getCount, getPathToS3Bucket } from 'lib/utils';
import truncate from 'lodash/truncate';
import {
  Button, Card, Modal, Image, List, Loader, Popup
} from 'semantic-ui-react';
import iconVideoCamera from 'static/icons/icon_32px_videoCamera.png';
import iconRemove from 'static/icons/icon_remove.svg';
import iconReplace from 'static/icons/icon_replace.svg';
import FileUploadProgressBar from 'components/admin/projects/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
import { UploadContext } from '../VideoEdit/VideoEdit';
import './ProjectUnitItem.scss';

const EditSingleProjectItem = dynamic( () => import( /* webpackChunkName: "editSingleProjectItem" */ '../EditSingleProjectItem/EditSingleProjectItem' ) );
const GeneralError = dynamic( () => import( /* webpackChunkName: "generalError" */ 'components/errors/GeneralError/GeneralError' ) );

const ProjectUnitItem = props => {
  const { projectId, unit, filesToUpload } = props;

  // const PLACEHOLDER = '/static/images/thumbnail_video.jpg';
  const PLACEHOLDER = null;

  const [thumbnail, setThumbnail] = useState( PLACEHOLDER );
  const [title, setTitle] = useState( '' );
  const [unitUploadComplete, setUnitUploadComplete] = useState( false );
  const [error, setError] = useState( false );

  // do not put in state as it will create a new object and will not track upload
  // need a better solution as this is prone to errors
  const unitFileToUpload = filesToUpload.filter( file => file.language === unit.language.id );

  const uploadInProgress = useContext( UploadContext );

  // implemment subscriptions to track thumbnail changes
  const getThumbnail = u => {
    if ( u && u.thumbnails && u.thumbnails[0] && u.thumbnails[0].image ) {
      return `${getPathToS3Bucket()}/${u.thumbnails[0].image.url}`;
    }
    // return PLACEHOLDER;
  };

  const getStreams = () => {
    const filesCount = ( unit.files && unit.files.length ) || 0;
    if ( filesCount > 0 ) {
      return unit.files.reduce( ( acc, file ) => (
        [...acc, ...file.stream]
      ), [] );
    }
    return [];
  };

  const getStreamUrls = ( site = 'vimeo' ) => {
    const streams = getStreams();
    return streams.reduce( ( acc, stream ) => {
      if ( stream.site === site && stream.url ) {
        acc.push( stream.url );
      }
      return acc;
    }, [] );
  };

  const handleOnComplete = () => {
    setUnitUploadComplete( true );
  };

  useEffect( () => {
    setThumbnail( getThumbnail( unit ) );
    setTitle( unit && unit.title ? unit.title : '[Title]' );

    // expected uploads should equal successful uploads
    const hasError = getCount( unit.files ) > getCount( getStreamUrls() );
    setError( hasError );
  }, [unit] );


  const renderProjectItem = () => (
    <Card className="project-unit-item">
      <div className="image-wrapper">
        { thumbnail
          ? ( <Image src={ thumbnail } fluid /> )
          : <div className="placeholder" />
        }
        { /* Has an upload been triggered and if so, are the files applicable to this unit complete? */ }
        { uploadInProgress && !unitUploadComplete && ( <Loader active size="small" /> ) }

        { /* Remove file overlay if above conditions are met */ }
        { !!unitFileToUpload.length && !unitUploadComplete && (
          <List className="file-list">
            { unitFileToUpload.map( file => <List.Item key={ file.id }>{ truncate( file.input.name, { length: 45 } ) }</List.Item> ) }
          </List>
        )
        }

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
      <Card.Content className={ error ? 'error' : '' }>
        <Card.Header>{ title }</Card.Header>
        <Card.Meta>
          <List>
            <List.Item>Language: { unit.language.displayName }</List.Item>
            <List.Item>Files: { getCount( getStreamUrls() ) }</List.Item>
            { error
              && (
                <List.Item>
                  <GeneralError msg="Uploading Error">
                    <Button.Group
                      basic
                      className="actions"
                      size="mini"
                      style={ { border: 'none' } }
                    >
                      <Popup
                        trigger={ (
                          <Button className="replace" style={ { marginRight: 0, padding: '0.25rem' } }>
                            <img src={ iconReplace } alt="replace icon" />
                          </Button>
                        ) }
                        content="Replace this video unit"
                        hideOnScroll
                        inverted
                        on={ ['hover', 'focus'] }
                        size="mini"
                      />
                      <Popup
                        trigger={ (
                          <Button className="delete" style={ { border: 'none', padding: '0.25rem' } }>
                            <img src={ iconRemove } alt="delete icon" />
                          </Button>
                        ) }
                        content="Delete this video unit"
                        hideOnScroll
                        inverted
                        on={ ['hover', 'focus'] }
                        size="mini"
                      />
                    </Button.Group>
                  </GeneralError>
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
