import React, { useState } from 'react';
import { Button, Confirm } from 'semantic-ui-react';
import ButtonAddFiles from 'components/ButtonAddFiles/ButtonAddFiles';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import FileUploadProgressBar from 'components/admin/ProjectEdit/FileUploadProgressBar/FileUploadProgressBar';
import FormInstructions from 'components/admin/ProjectEdit/FormInstructions/FormInstructions';
import ProjectHeader from 'components/admin/ProjectHeader/ProjectHeader';
import UploadSuccessMsg from 'components/admin/ProjectEdit/UploadSuccessMsg/UploadSuccessMsg';
import PressPackageDetailsForm from './PackageDetailsForm/PressPackageDetailsForm/PressPackageDetailsForm';
import PackageFiles from './PackageFiles/PackageFiles';
// remove mocks import after GraphQL
import { props as testProps, mocks } from './PackageDetailsForm/PressPackageDetailsForm/mocks';
import './PackageEdit.scss';

const PackageEdit = () => {
  const [projectId, setProjectId] = useState( /* props.id */ '' );
  const [displayTheUploadSuccessMsg, setDisplayTheUploadSuccessMsg] = useState( false );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );

  const displayConfirmDelete = () => setDeleteConfirmOpen( true );
  const handleDeleteCancel = () => setDeleteConfirmOpen( false );

  const handleDeleteConfirm = () => {
    console.log( 'Confirm Delete' );
  };

  const handlePublish = () => {
    console.log( 'Publish' );
  };

  const handleSaveExit = () => {
    console.log( 'Save & Exit' );
  };

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
            onClick={ displayConfirmDelete }
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
            onCancel={ handleDeleteCancel }
            onConfirm={ handleDeleteConfirm }
            cancelButton="No, take me back"
            confirmButton="Yes, delete forever"
          />

          <Button
            className="edit-package__btn--save-draft"
            content="Save & Exit"
            basic
            onClick={ handleSaveExit }
            disabled={ false }
          />

          <Button
            className="edit-package__btn--publish"
            content="Publish"
            onClick={ handlePublish }
          />
        </ProjectHeader>
      </div>

      { /* upload progress */ }
      <div className="edit-package__status">
        { !projectId && !isUploading && <FormInstructions type="package" /> }
        { displayTheUploadSuccessMsg && <UploadSuccessMsg /> }

        { isUploading
          && (
          <FileUploadProgressBar
            filesToUpload={ filesToUpload }
            label="Please keep this page open until upload is complete"
            fileProgessMessage
          />
          ) }
      </div>

      <div className="edit-package__form">
        <PressPackageDetailsForm
          id={ testProps.id }
          // send mock data here for UI dev, remove after GraphQL
          data={ mocks[0].result.data }
          handleUpload={ () => {} }
          updateNotification={ () => {} }
        />
      </div>

      <div className="edit-package__files">
        <PackageFiles
          id={ testProps.id }
          // send mock data here for UI dev, remove after GraphQL
          data={ mocks[0].result.data }
        />
      </div>

      <div className="edit-package__actions">
        <h3 className="headline">
          { /* publishedAndUpdated */ false && 'It looks like you made changes to your package. Do you want to publish changes?' }
          { /* notPublished */ true && 'Your package looks great! Are you ready to Publish?' }
          { /* publishedAndNotUpdated */ false && 'Not ready to share with the world yet?' }
        </h3>

        <ButtonAddFiles className="basic edit-package__btn--add-more" accept=".doc, .docx" onChange={ () => {} } multiple>+ Add Files</ButtonAddFiles>
        { /* !publishedAndNotUpdated */ true && (
          <Button
            className={ `edit-package__btn--${/* publishedAndUpdated */false ? 'edit' : 'publish'}` }
            onClick={ /* handlePublish */ () => {} }
          >
            Publish{ /* publishedAndUpdated */ false && ' Changes' }
          </Button>
        ) }
      </div>
    </div>
  );
};

export default PackageEdit;
