import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { getCount } from 'lib/utils';
import ActionButtons from 'components/admin/ActionButtons/ActionButtons';
import ApolloError from 'components/errors/ApolloError';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import { PACKAGE_QUERY } from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from './PackageDetailsFormContainer/PackageDetailsFormContainer';
import PackageActions from './PackageActions/PackageActions';
import PackageFiles from './PackageFiles/PackageFiles';
import './PackageEdit.scss';

const PackageEdit = props => {
  // const SAVE_MSG_DELAY = 2000;
  let saveMsgTimer = null;

  const [packageId, setPackageId] = useState( '' );
  const [mounted, setMounted] = useState( false );
  const [error, setError] = useState( {} );
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
    const { pkgQuery } = props;
    if ( pkgQuery && pkgQuery.pkg && pkgQuery.pkg.documents ) {
      const { documents } = pkgQuery.pkg;
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
  }, [props.pkgQuery] );

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

  const deletePackageEnabled = () => {
    const { pkgQuery } = props;
    /**
     * disable delete package button if either there
     * is no package id OR package has been published
     */
    return !packageId || ( pkgQuery && pkgQuery.pkg && pkgQuery.pkg.publishedAt );
  };

  const handleDisplaySaveMsg = () => {
    if ( mounted ) {
      updateNotification( '' );
    }
    saveMsgTimer = null;
  };

  const handleExit = () => {
    props.router.push( { pathname: '/admin/dashboard' } );
  };

  const handleDeleteConfirm = () => {
    console.log( 'Confirm Delete' );
    // const { deletePackage } = props;

    // const deletedPackageId = await deletePackage( {
    //   variables: { id: packageId }
    // } ).catch( err => { setError( err ); } );

    // if ( deletedPackageId ) {
    //   handleExit();
    // }
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

  return (
    <div className="edit-package">
      <div className="edit-package__header">
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
      >
        { hasUploadCompleted && <PackageFiles id={ packageId } /> }
      </PackageDetailsFormContainer>

      { /**
         * can possibly be shared with VideoReview
         * with a little modification
         */ }
      { hasUploadCompleted && <PackageActions handlePublish={ handlePublish } handleUnPublish={ handleUnPublish } /> }
    </div>
  );
};

PackageEdit.propTypes = {
  // deletePackage: PropTypes.func,
  pkgQuery: PropTypes.object,
  // updatePackage: PropTypes.func,
  // updateFile: PropTypes.func,
  router: PropTypes.object,
};

export default compose(
  withRouter,
  graphql( PACKAGE_QUERY, {
    name: 'pkgQuery',
    options: props => ( {
      variables: { id: props.router.query.id }
    } ),
    skip: props => !props.router.query.id
  } ),
  // graphql( DELETE_PACKAGE_MUTATION, { name: 'deletePackage' } ),
  // graphql( UPDATE_PACKAGE_MUTATION, {
  //   name: 'updatePackage',
  //   options: props => ( {
  //     refetchQueries: [{
  //       query: PACKAGE_PUBLISHED_QUERY,
  //       variables: { id: props.id }
  //     }],
  //     onCompleted: () => {}
  //   } )
  // } )
)( PackageEdit );
