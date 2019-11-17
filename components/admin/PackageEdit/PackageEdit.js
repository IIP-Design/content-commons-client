import React, { useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { compose /* , graphql */ } from 'react-apollo';
import { Button, Confirm } from 'semantic-ui-react';
import ApolloError from 'components/errors/ApolloError';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import FormInstructions from 'components/admin/FormInstructions/FormInstructions';
import Notification from 'components/Notification/Notification';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import UploadSuccessMsg from 'components/admin/UploadSuccessMsg/UploadSuccessMsg';
import PressPackageDetailsForm from './PackageDetailsForm/PressPackageDetailsForm/PressPackageDetailsForm';
import PackageActions from './PackageActions/PackageActions';
import PackageFiles from './PackageFiles/PackageFiles';
// remove mocks import after GraphQL
import { props as testProps, mocks } from './PackageDetailsForm/PressPackageDetailsForm/mocks';
import './PackageEdit.scss';

const PackageEdit = props => {
  const SAVE_MSG_DELAY = 2000;
  const UPLOAD_SUCCESS_MSG_DELAY = SAVE_MSG_DELAY + 1000;

  let uploadSuccessTimer = null;
  let saveMsgTimer = null;

  const [packageId, setPackageId] = useState( /* props.id */ '' );
  const [mounted, setMounted] = useState( false );
  const [error, setError] = useState( {} );
  const [displayTheUploadSuccessMsg, setDisplayTheUploadSuccessMsg] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );

  const [notification, setNotification] = useState( {
    notificationMessage: '',
    showNotification: false
  } );

  useEffect( () => {
    setMounted( true );
    return () => {
      setMounted( false );
      clearTimeout( uploadSuccessTimer );
      clearTimeout( saveMsgTimer );

      // props.uploadReset(); // clear files to upload store
    };
  }, [] );

  const updateNotification = msg => {
    setNotification( {
      notificationMessage: msg,
      showNotification: !!msg
    } );
  };

  const addPackageIdToUrl = id => {
    const { router } = props;

    const path = `${router.asPath}&id=${id}`;
    router.replace( router.asPath, path, { shallow: true } );
  };

  const delayUnmount = ( fn, timer, delay ) => {
    if ( timer ) clearTimeout( timer );
    /* eslint-disable no-param-reassign */
    timer = setTimeout( fn, delay );
  };

  const handleDisplayUploadSuccessMsg = () => {
    if ( mounted ) {
      setDisplayTheUploadSuccessMsg( false );
    }
    uploadSuccessTimer = null;
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

  const handleUploadProgress = () => {
    console.log( 'Handle Upload Progress' );
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

  const handleSaveDraft = () => {
    console.log( 'Save Draft' );
  };

  const handleUploadComplete = () => {
    console.log( 'Upload Complete' );
    // setDisplayTheUploadSuccessMsg( true );
    // updateNotification( 'Project saved as draft' );
    // delayUnmount( handleDisplaySaveMsg, saveMsgTimer, SAVE_MSG_DELAY );
    // delayUnmount( handleDisplayUploadSuccessMsg, uploadSuccessTimer, UPLOAD_SUCCESS_MSG_DELAY );
  };

  const handlePublish = () => {
    console.log( 'Publish' );

    // const { id, title } = pkg;
    // const { /* uploadExecute, */ updateFile } = props;

    // // If there are files to upload, upload them
    // if ( filesToUpload && filesToUpload.length ) {
    //   setIsUploading( true );

    //   // 1. Upload files to S3 and fetch file meta data
    //   await uploadExecute( id, filesToUpload, handleUploadProgress, updateFile );

    //   // 2. once all files have been uploaded, create and save new project (only new)
    //   handleSaveDraft( id, title, tags );

    //   // 3. clean up upload process
    //   handleUploadComplete();

    //   // 4. set package id to newly created package (what if existing package?)
    //   setPackageId( id );

    //   // 5. update url to reflect a new package (only new)
    //   addPackageIdToUrl( id );
    // }
  };

  const handleUpload = () => {
    console.log( 'Upload' );
  };

  const centeredStyles = {
    position: 'absolute',
    top: '9em',
    left: '50%',
    transform: 'translateX(-50%)'
  };

  const { showNotification, notificationMessage } = notification;

  // for UI dev, remove afterwards
  const isUploading = false;
  const filesToUpload = [];

  return (
    <div className="edit-package">
      <div className="edit-package__header">
        <ProjectHeader icon="file" text="Package Details">
          <Button
            className="edit-package__btn--delete"
            content="Delete All"
            basic
            onClick={ () => setDeleteConfirmOpen( true ) }
            disabled={ false }
          />

          <Confirm
            className="delete"
            open={ deleteConfirmOpen }
            content={ (
              <ConfirmModalContent
                className="delete_confirm delete_confirm--package"
                headline="Are you sure you want to delete this package?"
              >
                <p>This package will be permanently removed from the Content Cloud. Any files that you uploaded here will not be uploaded.</p>
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
            disabled={ false }
          />

          <Button
            className="edit-package__btn--publish"
            content="Publish"
            onClick={ handlePublish }
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

      { /* upload progress */ }
      <div className="edit-package__status">
        { !packageId && !isUploading && <FormInstructions type="package" /> }
        { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            label="Please keep this page open until upload is complete"
            fileProgressMessage
          />
          ) }
      </div>

      <PressPackageDetailsForm
        id={ packageId }
        handleUpload={ handleUpload }
        updateNotification={ updateNotification }
        // send mock data here for UI dev, remove after GraphQL
        data={ mocks[0].result.data }
      >
        <PackageFiles
          id={ packageId }
          // send mock data here for UI dev, remove after GraphQL
          data={ mocks[0].result.data }
        />

        <PackageActions handlePublish={ handlePublish } />
      </PressPackageDetailsForm>
    </div>
  );
};

PackageEdit.propTypes = {
  // id: PropTypes.string,
  // deletePackage: PropTypes.func,
  // packageQuery: PropTypes.object,
  // updatePackage: PropTypes.func,
  // updateFile: PropTypes.func,
  router: PropTypes.object,
};

export default compose(
  withRouter,
  // graphql( PACKAGE_QUERY, {
  //   name: 'packageQuery',
  //   options: props => ( {
  //     variables: { id: props.id }
  //   } ),
  //   skip: props => !props.id
  // } ),
  // graphql( DELETE_PACKAGE_MUTATION, { name: 'deletePackage' } ),
  // graphql( UPDATE_PACKAGE_MUTATION, {
  //   name: 'updatePackage',
  //   options: props => ( {
  //     refetchQueries: [{
  //       query: PACKAGE_QUERY,
  //       variables: { id: props.id },
  //     }],
  //     onCompleted: () => {}
  //   } )
  // } )
)( PackageEdit );
