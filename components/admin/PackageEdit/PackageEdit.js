import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { Button, Confirm } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import { PACKAGE_DETAILS_QUERY } from 'lib/graphql/queries/package';
import PackageDetailsFormContainer from './PackageDetailsFormContainer/PackageDetailsFormContainer';
import PackageActions from './PackageActions/PackageActions';
import PackageFiles from './PackageFiles/PackageFiles';
// remove mocks import after GraphQL
import { mocks as pkgPublishedQuery } from './mocks';
import { mocks } from './PackageDetailsFormContainer/mocks';
import './PackageEdit.scss';

const PackageEdit = props => {
  const SAVE_MSG_DELAY = 2000;
  let saveMsgTimer = null;

  const [packageId, setPackageId] = useState( '' );
  const [mounted, setMounted] = useState( false );
  const [error, setError] = useState( {} );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );

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
    // for UI dev, remove after GraphQL
    const { publishedAt } = pkgPublishedQuery[0].result.data.package;
    return !packageId || publishedAt;

    // const { pkgPublishedQuery } = props;
    // /**
    //  * disable delete package button if either there
    //  * is no package id OR package has been published
    //  */
    // return !packageId || ( pkgPublishedQuery && pkgPublishedQuery.package && pkgPublishedQuery.package.publishedAt );
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
          { /**
             * can move buttons to separate, shared component
             * since they're almost the same as VideoEdit
             * and VideoReview
             */ }
          <Button
            className="edit-package__btn--delete"
            content="Delete All"
            basic
            onClick={ () => setDeleteConfirmOpen( true ) }
            disabled={ deletePackageEnabled() }
          />

          <Confirm
            className="delete"
            open={ deleteConfirmOpen }
            content={ (
              <ConfirmModalContent
                className="delete_confirm delete_confirm--package"
                headline="Are you sure you want to delete this package and its files?"
              >
                <p>This package will be removed permanently from the Content Cloud. Any files uploaded in this package will also be removed permanently.</p>
              </ConfirmModalContent>
            ) }
            onCancel={ () => setDeleteConfirmOpen( false ) }
            onConfirm={ handleDeleteConfirm }
            cancelButton="No, take me back"
            confirmButton="Yes, delete forever"
          />

          <Button
            className="edit-package__btn--save-draft"
            content="Save & Exit"
            basic
            onClick={ handleExit }
            disabled={ !packageId }
          />

          <Button
            className="edit-package__btn--publish"
            content="Publish"
            onClick={ handlePublish }
            disabled={ !packageId }
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
        // send mock data here for UI dev, remove after GraphQL
        data={ mocks[0].result.data }
      >
        <PackageFiles
          id={ packageId }
          // send mock data here for UI dev, remove after GraphQL
          data={ mocks[0].result.data }
        />
      </PackageDetailsFormContainer>

      { /**
         * can possibly be shared with VideoReview
         * with a little modification
         */ }
      <PackageActions
        handlePublish={ handlePublish }
        handleUnPublish={ handleUnPublish }
      />
    </div>
  );
};

PackageEdit.propTypes = {
  // id: PropTypes.string,
  // deletePackage: PropTypes.func,
  // pkgPublishedQuery: PropTypes.object,
  // updatePackage: PropTypes.func,
  // updateFile: PropTypes.func,
  router: PropTypes.object,
};

export default compose(
  withRouter,
  graphql( PACKAGE_DETAILS_QUERY, {
    name: 'pkgDetailsQuery',
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
