import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { useMutation, useQuery } from '@apollo/react-hooks';
import { getCount } from 'lib/utils';
import { Loader } from 'semantic-ui-react';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ActionHeadline from 'components/admin/ActionHeadline/ActionHeadline';
import ApolloError from 'components/errors/ApolloError';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import ButtonPublish from 'components/admin/ButtonPublish/ButtonPublish';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import { PACKAGE_QUERY, DELETE_PACKAGE_MUTATION } from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from 'components/admin/PackageEdit/PackageDetailsFormContainer/PackageDetailsFormContainer';
import PackageFiles from 'components/admin/PackageEdit/PackageFiles/PackageFiles';
import './PackageEdit.scss';

const PackageEdit = props => {
  const { loading, error: queryError, data } = useQuery( PACKAGE_QUERY, {
    partialRefetch: true,
    variables: { id: props.router.query.id },
    displayName: 'PackageQuery',
    skip: !props.router.query.id
  } );
  const [deletePackage] = useMutation( DELETE_PACKAGE_MUTATION );

  // const SAVE_MSG_DELAY = 2000;
  let saveMsgTimer = null;

  const [packageId, setPackageId] = useState( '' );
  const [mounted, setMounted] = useState( false );
  const [error, setError] = useState( {} );
  const [isDirty, setIsDirty] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [hasUploadCompleted, setHasUploadCompleted] = useState( false );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );

  useEffect( () => {
    setMounted( true );
    if ( props.router && props.router.query && props.router.query.id ) {
      setPackageId( props.router.query.id );
    } else {
      /**
       * What to do if no `id` in the `query`?
       * Some type of error handling? Send to dashboard?
       * Do nothing?
       */
    }

    return () => {
      setMounted( false );
      clearTimeout( saveMsgTimer );
    };
  }, [] );

  useEffect( () => {
    if ( data && data.pkg && data.pkg.documents ) {
      const { documents } = data.pkg;
      /**
       * Display files after upload finishes and upload modal
       * closes. For now, use documents count for UI dev. Perhaps,
       * it'd be better display files after all thumbnails have
       * resolved.
       */
      if ( documents ) {
        setHasUploadCompleted( Boolean( getCount( documents ) ) );
      }
    }
  }, [data] );

  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  };

  const delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };

  const deletePackageEnabled = () => (
    /**
     * disable delete package button if either there
     * is no package id OR package has been published
     */
    !packageId || ( data && data.pkg && !!data.pkg.publishedAt )
  );

  const handleDisplaySaveMsg = () => {
    if ( mounted ) {
      updateNotification( '' );
    }
    saveMsgTimer = null;
  };

  const handleExit = () => {
    props.router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = async () => {
    const deletedPackageId = await deletePackage( {
      variables: { id: packageId }
    } ).catch( err => { setError( err ); } );

    if ( deletedPackageId ) {
      handleExit();
    }
  };

  const handlePublish = () => {
    console.log( 'Publish' );
    // Prevent multiple clicks - multiple clicks resulted in Package going into PUBLISHING status
    // if ( !e.detail || e.detail === 1 ) e.target.disabled = true;

    // const { publishPackage } = props;

    // try {
    //   setPublishing( true );
    //   console.log( 'Publishing to queue...' );
    //   await publishPackage( { variables: { id } } );

    //   // Remove updated package from redux packageUpdate state
    //   props.packageUpdated( id, false );
    // } catch ( err ) {
    //   setPublishing( false );
    //   setPublishError( err );
    // }
  };

  const handleUnPublish = () => {
    console.log( 'Unpublish' );
    // Prevent multiple clicks - multiple clicks resulted in package going into PUBLISHING status
    // if ( !e.detail || e.detail === 1 ) e.target.disabled = true;

    // const { unPublishPackage } = props;

    // try {
    //   setPublishing( true );
    //   await unPublishPackage( { variables: { id } } );

    //   // Remove updated package from redux packageUpdate state
    //   props.packageUpdated( id, false );
    // } catch ( err ) {
    //   setPublishing( false );
    //   setPublishError( err );
    // }
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
              publish: handlePublish
            } }
            show={ {
              delete: hasUploadCompleted,
              save: hasUploadCompleted,
              publish: hasUploadCompleted
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
        id={ packageId }
        updateNotification={ updateNotification }
        hasUploadCompleted={ hasUploadCompleted }
        setIsDirty={ setIsDirty }
      >
        { hasUploadCompleted && <PackageFiles id={ packageId } /> }
      </PackageDetailsFormContainer>

      { /**
         * can possibly be shared with VideoReview
         * with a little modification
         */ }
      { hasUploadCompleted
        && (
          <section className="actions">
            <ActionHeadline
              className="headline"
              type="package"
              published={ pkg && pkg.status === 'PUBLISHED' }
              updated={ isDirty }
            />

            <ButtonAddFiles className="basic action-btn btn--add-more" accept=".doc, .docx" onChange={ () => {} } multiple>+ Add Files</ButtonAddFiles>

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
  router: PropTypes.object,
};

export default withRouter( PackageEdit );
