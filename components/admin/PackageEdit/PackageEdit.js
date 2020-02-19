import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import PropTypes from 'prop-types';
import { Loader } from 'semantic-ui-react';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ActionHeadline from 'components/admin/ActionHeadline/ActionHeadline';
import ApolloError from 'components/errors/ApolloError';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import ButtonPublish from 'components/admin/ButtonPublish/ButtonPublish';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import {
  PACKAGE_QUERY,
  DELETE_PACKAGE_MUTATION,
  PUBLISH_PACKAGE_MUTATION,
  UNPUBLISH_PACKAGE_MUTATION
} from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsFormContainer';
import PackageFiles from 'components/admin/PackageEdit/PackageFiles/PackageFiles';
import './PackageEdit.scss';

const PackageEdit = props => {
  const { id: packageId } = props;
  const router = useRouter();

  const {
    loading, error: queryError, data, startPolling, stopPolling
  } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id: packageId },
    displayName: 'PackageQuery',
    skip: !packageId
  } );

  const [deletePackage] = useMutation( DELETE_PACKAGE_MUTATION );
  const [publishPackage] = useMutation( PUBLISH_PACKAGE_MUTATION );
  const [unpublishPackage] = useMutation( UNPUBLISH_PACKAGE_MUTATION );

  const saveMsgTimer = null;

  const [error, setError] = useState( {} );
  const [isDirty, setIsDirty] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [hasInitialUploadCompleted, setHasInitialUploadCompleted] = useState( false );
  const [publishing, setPublishing] = useState( false );
  const [publishStatus, setPublishStatus] = useState( '' );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );


  /**
   * If an error occurs during publish or unpublish, stop polling and display error to the user
   * @param {string} id package id
   * @param {sring} status package publish status
   */
  const handlePublishError = ( id, status ) => {
    setError( { otherError: `ERROR: Package failed to ${status.substr( 0, status.indexOf( '_' ) ).toLowerCase()}` } );
    stopPolling();
    setPublishing( false );
  };

  /**
   * The publish and unpublish actions start a poll to detect a publish status change to the package
   * via its status prop or detect an error.
   */
  const handleStatusChange = () => {
    const id = data?.pkg?.id;
    const status = data?.pkg?.status;

    if ( status === 'PUBLISH_FAILURE' || status === 'UNPUBLISH_FAILURE' ) {
      handlePublishError( id, status );
    }

    // We assume that the status has changed during the operation, i.e. DRAFT to PUBLISHED
    // When the saved status = the query status, we stop the poll as operation completed successfully
    if ( status === publishStatus ) {
      if ( publishing ) {
        stopPolling();
        // route to dashboard
        router.push( '/admin/dashboard' );
      }
    }

    setPublishStatus( status );
  };

  useEffect( () => () => {
    clearTimeout( saveMsgTimer );
    stopPolling();
  }, [] );


  useEffect( () => {
    if ( data && data.pkg ) {
      /**
       * Display files after initial upload is saved and upload modal
       * closes. Use the create query param to track action button display.
       * This param is removed after initial save.
       * We cannot rely on using the existence of documents as all documents
       * could be removed after intial upload and we may need to delete the package
       * Perhaps, it'd be better display files after all thumbnails have
       * resolved.
       */
      setHasInitialUploadCompleted( router.query.action !== 'create' );

      // When the data changes, check status
      handleStatusChange();
    }
  }, [data] );


  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  };

  const deletePackageEnabled = () => (
    /**
     * disable delete package button if either there
     * is no package id OR package has been published
     */
    !packageId || ( data && data.pkg && !!data.pkg.publishedAt )
  );

  /**
   * Execute publish or unpublish mutation and start polling
   * @param {function} pulishFunc publish or unpublish graphql mutation
   */
  const executePublishOperation = async pulishFunc => {
    if ( !publishing ) {
      try {
        setPublishing( true );
        await pulishFunc( { variables: { id: packageId } } );
        startPolling( 100 );
      } catch ( err ) {
        setPublishing( false );
        setError( err );
        stopPolling();
      }
    }
  };


  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedPackageId = await deletePackage( {
      variables: { id: packageId }
    } ).catch( err => { setError( err ); } );

    if ( deletedPackageId ) {
      handleExit();
    }
  };

  const handlePublish = async () => {
    executePublishOperation( publishPackage );
  };

  const handleUnPublish = async () => {
    executePublishOperation( unpublishPackage );
  };

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  const { showNotification, notificationMessage } = notification;

  if ( loading ) {
    return (
      <div style={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
      } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading package details page..."
        />
      </div>
    );
  }

  if ( queryError ) {
    return (
      <div style={ centeredStyles }>
        <ApolloError error={ queryError } />
      </div>
    );
  }

  if ( !data ) return null;
  const { pkg } = data;

  return (
    <div className="edit-package">
      <div className="header">
        <ProjectHeader icon="file" text="Package Details">
          <ActionButtons
            type="package"
            deleteConfirmOpen={ deleteConfirmOpen }
            setDeleteConfirmOpen={ setDeleteConfirmOpen }
            disabled={ {
              delete: deletePackageEnabled(),
              save: !packageId,
              publish: !packageId
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: () => console.log( 'publish update' ), // handlePublish,
              unpublish: handleUnPublish
            } }
            show={ {
              delete: true, // package has been completed, show delete in the event user wants to delete instead of uploading files
              save: hasInitialUploadCompleted,
              publish: hasInitialUploadCompleted && pkg.status === 'DRAFT',
              publishChanges: false,
              unpublish: pkg.status === 'PUBLISHED'
            } }
          />
        </ProjectHeader>
      </div>

      <div style={ centeredStyles }>
        <ApolloError error={ error } />
      </div>
      { /* Form data saved notification */ }
      <Notification
        el="p"
        customStyles={ centeredStyles }
        show={ showNotification }
        msg={ notificationMessage }
      />
      <PackageDetailsFormContainer
        pkg={ pkg }
        updateNotification={ updateNotification }
        hasInitialUploadCompleted={ hasInitialUploadCompleted }
        setIsDirty={ setIsDirty }
      >
        <PackageFiles pkg={ pkg } hasInitialUploadCompleted={ hasInitialUploadCompleted } />
      </PackageDetailsFormContainer>
      { /**
       * can possibly be shared with VideoReview
       * with a little modification
       */ }
      { hasInitialUploadCompleted && (
        <section className="actions">
          <ActionHeadline
            className="headline"
            type="package"
            published={ pkg && pkg.status === 'PUBLISHED' }
            updated={ isDirty }
          />

          <ButtonAddFiles
            className="basic action-btn btn--add-more"
            accept=".doc, .docx"
            onChange={ () => {} }
            multiple
          >
            + Add Files
          </ButtonAddFiles>

          <ButtonPublish
            handlePublish={ handlePublish }
            handleUnPublish={ handleUnPublish }
            status={ ( pkg && pkg.status ) || 'DRAFT' }
            updated={ isDirty }
          />
        </section>
      ) }
    </div>
  );
};

PackageEdit.propTypes = {
  id: PropTypes.string
};

export default PackageEdit;
