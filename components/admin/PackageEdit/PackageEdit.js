import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import usePublish from 'lib/hooks/usePublish';
import useIsDirty from 'lib/hooks/useIsDirty';
import PropTypes from 'prop-types';
import { Button, Loader } from 'semantic-ui-react';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ActionHeadline from 'components/admin/ActionHeadline/ActionHeadline';
import ApolloError from 'components/errors/ApolloError';
import useToggleModal from 'lib/hooks/useToggleModal';
import { useCrudActionsDocument } from 'lib/hooks/useCrudActionsDocument';
import EditPackageFiles from 'components/admin/PackageEdit/EditPackageFilesModal/EditPackageFilesModal';
import ButtonPublish from 'components/admin/ButtonPublish/ButtonPublish';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import {
  PACKAGE_QUERY,
  DELETE_PACKAGE_MUTATION,
  PUBLISH_PACKAGE_MUTATION,
  UNPUBLISH_PACKAGE_MUTATION,
  UPDATE_PACKAGE_STATUS_MUTATION,
} from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsFormContainer';
import PackageFiles from 'components/admin/PackageEdit/PackageFiles/PackageFiles';
import './PackageEdit.scss';

const PackageEdit = props => {
  const { id: packageId } = props;
  const router = useRouter();

  const {
    loading, error: queryError, data, startPolling, stopPolling,
  } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id: packageId },
    displayName: 'PackageQuery',
    skip: !packageId,
  } );

  const { saveFiles } = useCrudActionsDocument( {
    pollQuery: PACKAGE_QUERY,
    variables: { id: packageId },
  } );

  const { modalOpen, handleOpenModel, handleCloseModal } = useToggleModal();


  const [deletePackage] = useMutation( DELETE_PACKAGE_MUTATION );
  const [publishPackage] = useMutation( PUBLISH_PACKAGE_MUTATION );
  const [unpublishPackage] = useMutation( UNPUBLISH_PACKAGE_MUTATION );
  const [updatePackageStatus] = useMutation( UPDATE_PACKAGE_STATUS_MUTATION );

  const [error, setError] = useState( {} );
  const [progress, setProgress] = useState( 0 );

  // publishOperation tells the action buttons which operation is executing so that it can
  // set its loading indicator on the right button
  const [publishOperation, setPublishOperation] = useState( '' );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [hasInitialUploadCompleted, setHasInitialUploadCompleted] = useState( false );
  const [isFormValid, setIsFormValid] = useState( true );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false,
  } );

  const {
    publishing,
    publishError,
    executePublishOperation,
    handleStatusChange,
  } = usePublish(
    startPolling,
    stopPolling,
    updatePackageStatus,
  );

  const isDirty = useIsDirty( data?.pkg );

  useEffect( () => {
    if ( data && data.pkg ) {
      /**
       * Display files after initial upload is saved and upload modal
       * closes. Use the create query param to track action button display.
       * This param is removed after initial save.
       * We cannot rely on using the existence of documents as all documents
       * could be removed after initial upload and we may need to delete the package
       * Perhaps, it'd be better display files after all thumbnails have
       * resolved.
       */
      setHasInitialUploadCompleted( router.query.action !== 'create' );

      // When the data changes, check status
      handleStatusChange( data.pkg );
    }
  }, [data] );


  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg,
    } );
  };

  const deletePackageEnabled = () => (
    /**
     * disable delete package button if either there
     * is no package id OR package has been published
     */
    !packageId || ( data && data.pkg && !!data.pkg.publishedAt )
  );


  const handleExit = () => {
    router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedPackageId = await deletePackage( {
      variables: { id: packageId },
    } ).catch( err => { setError( err ); } );

    if ( deletedPackageId ) {
      handleExit();
    }
  };

  const handlePublish = async () => {
    setPublishOperation( 'publish' );
    executePublishOperation( packageId, publishPackage );
  };

  const handlePublishChanges = async () => {
    setPublishOperation( 'publishChanges' );
    executePublishOperation( packageId, publishPackage );
  };

  const handleUnPublish = async () => {
    setPublishOperation( 'unpublish' );
    executePublishOperation( packageId, unpublishPackage );
  };

  const handleUploadProgress = ( progressEvent, file ) => {
    file.loaded = progressEvent.loaded;
    setProgress( progressEvent.loaded );
  };

  const handleSave = async ( toSave, toRemove ) => {
    const files = { toSave, toRemove };

    saveFiles( data.pkg, files, handleUploadProgress );
  };

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)',
  };

  const { showNotification, notificationMessage } = notification;

  if ( loading ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
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
              'delete': deletePackageEnabled(),
              save: !packageId || !isFormValid,
              publishChanges: !packageId || !pkg?.documents?.length,
              publish: !packageId || !pkg?.documents?.length,
            } }
            handle={ {
              deleteConfirm: handleDeleteConfirm,
              save: handleExit,
              publish: handlePublish,
              publishChanges: handlePublishChanges,
              unpublish: handleUnPublish,
            } }
            show={ {
              'delete': true, // package has been completed, show delete in the event user wants to delete instead of uploading files
              save: hasInitialUploadCompleted,
              publish: hasInitialUploadCompleted && pkg?.status === 'DRAFT',
              publishChanges: pkg?.publishedAt && isDirty,
              unpublish: pkg?.status === 'PUBLISHED',
            } }
            loading={ {
              publish: publishing && publishOperation === 'publish',
              publishChanges: publishing && publishOperation === 'publishChanges',
              unpublish: publishing && publishOperation === 'unpublish',
            } }
          />
        </ProjectHeader>
      </div>

      <div style={ centeredStyles }>
        <ApolloError error={ error } />
        <ApolloError error={ publishError } />
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
        setIsFormValid={ setIsFormValid }
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

          <EditPackageFiles
            filesToEdit={ pkg?.documents }
            extensions={ ['.doc', '.docx'] }
            trigger={ (
              <Button
                className="basic action-btn btn--add-more"
                onClick={ handleOpenModel }
                size="small"
                basic
              >
                + Add Files
              </Button>
            ) }
            title="Edit Package Files"
            modalOpen={ modalOpen }
            onClose={ handleCloseModal }
            save={ handleSave }
            progress={ progress } // use here to re-render modal
          />

          <ButtonPublish
            handlePublish={ handlePublish }
            handleUnPublish={ handleUnPublish }
            status={ ( pkg && pkg.status ) || 'DRAFT' }
            updated={ isDirty }
            disabled={ !packageId || !pkg.documents.length }
          />
        </section>
      ) }
    </div>
  );
};

PackageEdit.propTypes = {
  id: PropTypes.string,
};

export default PackageEdit;
