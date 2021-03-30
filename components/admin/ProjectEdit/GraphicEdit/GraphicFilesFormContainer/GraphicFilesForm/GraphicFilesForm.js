import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Confirm, Form, Input, Loader } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import Filename from 'components/admin/Filename/Filename';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { formatBytes, getCount } from 'lib/utils';
import './GraphicFilesForm.scss';

const GraphicFilesForm = props => {
  const {
    errors,
    files,
    projectId,
    save,
    setFieldValue,
    setFieldTouched,
    touched,
    values,
  } = props;

  const [fileIdToDelete, setFileIdToDelete] = useState( '' );
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState( false );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const handleReset = () => {
    setDeleteConfirmOpen( false );
    setFileIdToDelete( '' );
  };

  const handleDelete = async id => {
    await updateGraphicProject( {
      variables: {
        data: {
          type: 'SOCIAL_MEDIA',
          images: {
            'delete': {
              id,
            },
          },
        },
        where: {
          id: projectId,
        },
      },
    } )
      .then( handleReset )
      .catch( err => console.dir( err ) );
  };

  const handleOnChange = ( e, { name, value } ) => {
    setFieldValue( name, value );
    setFieldTouched( name, true, false );
  };

  const isTouched = ( id, field ) => touched?.[id] && touched[id][field];

  // eslint-disable-next-line no-extra-parens
  const showErrorMsg = ( id, field ) => ( isTouched( id, field ) ? errors?.[id] && errors[id][field] : '' );
  const renderThumbnail = ( image, filename ) => {
    const imgSrc = image.signedUrl || image?.input?.dataUrl;
    const imgAlt = image.alt || filename;

    if ( imgSrc ) {
      return (
        <img
          src={ imgSrc }
          alt={ imgAlt }
          className="thumbnail"
        />
      );
    }

    return null;
  };

  const uploadInProgress = false; // temp

  if ( !getCount( files ) ) {
    return (
      <div className="graphic-project-graphic-files">
        <p className="no-files">
          { projectId
            ? 'Please upload at least one graphic file.'
            : 'No files to upload' }
        </p>
      </div>
    );
  }

  const hasFormBeenUpdated = !!Object.keys( touched ).length;

  return (
    <div className="graphic-project-graphic-files">
      { projectId && hasFormBeenUpdated && <FormikAutoSave save={ save } /> }

      <Confirm
        className="delete"
        open={ deleteConfirmOpen }
        content={ (
          <ConfirmModalContent
            className="delete_confirm"
            headline="Are you sure you want to delete this graphic?"
          >
            <p>This graphic will be permanently removed from the Content Commons and any other projects or collections it appears on.</p>
          </ConfirmModalContent>
        ) }
        onCancel={ handleReset }
        onConfirm={ () => handleDelete( fileIdToDelete ) }
        cancelButton="No, take me back"
        confirmButton="Yes, delete forever"
      />

      <Form className="form-fields">
        { /* We may have to pull the fieldset into a separate component and memoize it
        as all forms are rendered on each keystroke when updating the title
        Check performance before optimizing */ }
        { files.map( file => {
          const { id, filename, filesize, input, language } = file;
          const _filename = projectId ? filename : input?.name;
          const _filesize = projectId ? filesize : input?.size;

          const value = projectId
            ? values[id]
            : {
              title: input.name || '',
              language,
              style: file.style,
              social: file.social,
            };

          return (
            <fieldset
              key={ id }
              className={ `graphic-file-${id}` }
              name={ _filename }
            >
              <VisuallyHidden el="legend">
                { `edit fields for ${_filename}` }
              </VisuallyHidden>

              <div
                className={ `image-wrapper ${projectId ? 'available' : 'unavailable'}` }
              >
                { renderThumbnail( file, value?.title ) }

                <FileRemoveReplaceButtonGroup
                  onRemove={ () => {
                    setDeleteConfirmOpen( true );
                    setFileIdToDelete( id );
                  } }
                  icon="trash"
                />

                { uploadInProgress && <Loader active size="small" /> }

                <div className="meta-wrap">
                  <div className="meta">
                    <span className="filename">
                      <Filename
                        children={ _filename }
                        filenameLength={ 30 }
                        numCharsBeforeBreak={ 20 }
                        numCharsAfterBreak={ 10 }
                      />
                    </span>

                    <span className="filesize">
                      { formatBytes( _filesize || 0, 1 ) }
                    </span>
                  </div>
                </div>
              </div>

              { uploadInProgress // more conditions needed?
                && (
                  <div className="progress-bar">
                    <button
                      className="cancel-upload"
                      onClick={ () => { console.log( 'cancel' ); } }
                      type="button"
                    >
                      Cancel
                    </button>
                    <FileUploadProgressBar
                      filesToUpload={ [] } // temp
                      barSize="tiny"
                      onComplete={ () => {} } // temp
                      showPercent
                    />
                  </div>
                ) }

              <div className="field">
                <Form.Field
                  id={ `title-${id}` }
                  name={ `${id}.title` }
                  control={ Input }
                  label="Graphic Title"
                  value={ value?.title || '' }
                  onChange={ handleOnChange }
                  className={ language.textDirection }
                  disabled={ !projectId }
                />
              </div>

              <div className="form-group two-col">
                <div className="language-field">
                  <LanguageDropdown
                    id={ `language-${id}` }
                    name={ `${id}.language` }
                    className="language"
                    label="Language"
                    value={ value?.language || '' }
                    error={ isTouched( id, 'language' ) && !value.language }
                    onChange={ handleOnChange }
                    disabled={ !projectId }
                    required
                  />
                  <p className="error-message">
                    { showErrorMsg( id, 'language' ) }
                  </p>
                </div>

                <div className="graphic-style-field">
                  <GraphicStyleDropdown
                    id={ `graphic-style-${id}` }
                    name={ `${id}.style` }
                    className="graphic-style"
                    omit={ ['Clean'] }
                    label="Style"
                    value={ value?.style || '' }
                    error={ isTouched( id, 'style' ) && !value.style }
                    onChange={ handleOnChange }
                    disabled={ !projectId }
                    required
                  />
                  <p className="error-message">
                    { showErrorMsg( id, 'style' ) }
                  </p>
                </div>
              </div>

              <div className="social-platform-field">
                <SocialPlatformDropdown
                  id={ `social-platform-${id}` }
                  name={ `${id}.social` }
                  className="social-platform"
                  label="Platform"
                  value={ value?.social || '' }
                  error={ isTouched( id, 'social' ) && !value.social }
                  onChange={ handleOnChange }
                  disabled={ !projectId }
                  multiple
                  search
                  closeOnBlur
                  closeOnChange
                  required
                />
                <p className="error-message">
                  { showErrorMsg( id, 'social' ) }
                </p>
              </div>
            </fieldset>
          );
        } ) }
      </Form>
    </div>
  );
};

GraphicFilesForm.propTypes = {
  errors: PropTypes.object,
  files: PropTypes.array,
  projectId: PropTypes.string,
  save: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  touched: PropTypes.object,
  values: PropTypes.object,
};

export default GraphicFilesForm;
