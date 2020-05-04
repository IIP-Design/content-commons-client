import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Confirm, Form, Input, Loader } from 'semantic-ui-react';
import ConfirmModalContent from 'components/admin/ConfirmModalContent/ConfirmModalContent';
import FileRemoveReplaceButtonGroup from 'components/admin/FileRemoveReplaceButtonGroup/FileRemoveReplaceButtonGroup';
import FileUploadProgressBar from 'components/admin/FileUploadProgressBar/FileUploadProgressBar';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
import VisuallyHidden from 'components/VisuallyHidden/VisuallyHidden';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { formatBytes, truncateAndReplaceStr } from 'lib/utils';
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
    values
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
          images: {
            'delete': {
              id
            }
          }
        },
        where: {
          id: projectId
        }
      }
    } )
      .then( handleReset )
      .catch( err => console.dir( err ) );
  };

  const handleOnChange = ( e, { name, value } ) => {
    setFieldValue( name, value );
    setFieldTouched( name, true, false );
  };

  const isTouched = ( id, field ) => (
    touched?.[id] && touched[id][field]
  );

  const showErrorMsg = ( id, field ) => (
    isTouched( id, field ) ? errors?.[id] && errors[id][field] : ''
  );

  const renderThumbnail = image => {
    if ( image ) {
      return (
        <img
          src={ image.signedUrl }
          alt={ image.alt }
          className="thumbnail fluid"
        />
      );
    }

    return <div className="placeholder" />;
  };

  const uploadInProgress = false; // temp

  return (
    <div className="graphic-project-graphic-files">
      { projectId && <FormikAutoSave save={ save } /> }

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
        { files.map( file => {
          const { id, filename, filesize, language } = file;
          const value = values[id];
          const name = filename?.length > 30
            ? truncateAndReplaceStr( filename, 20, 10 )
            : filename;

          return (
            <fieldset
              key={ id }
              className={ `graphic-file-${id}` }
              name={ filename }
            >
              <VisuallyHidden el="legend">
                { `edit fields for ${filename}` }
              </VisuallyHidden>

              <div className="image-wrapper">
                { renderThumbnail( file ) }

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
                      { filename !== name
                        ? (
                          <Fragment>
                            <button
                              tooltip={ filename }
                              type="button"
                              aria-hidden="true"
                              className="filename truncated"
                            >
                              { name }
                            </button>
                            <VisuallyHidden el="span">
                              { filename }
                            </VisuallyHidden>
                          </Fragment>
                        )
                        : filename }
                    </span>

                    <span className="filesize">
                      { formatBytes( filesize, 1 ) }
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
                  value={ value.title || '' }
                  onChange={ handleOnChange }
                  className={ language.textDirection }
                />
              </div>

              <div className="form-group two-col">
                <div className="language-field">
                  <LanguageDropdown
                    id={ `language-${id}` }
                    name={ `${id}.language` }
                    className="language"
                    label="Language"
                    value={ value.language || '' }
                    error={ isTouched( id, 'language' ) && !value.language }
                    onChange={ handleOnChange }
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
                    label="Style"
                    value={ value.style || '' }
                    error={ isTouched( id, 'style' ) && !value.style }
                    onChange={ handleOnChange }
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
                  value={ value.social || '' }
                  error={ isTouched( id, 'social' ) && !value.social }
                  onChange={ handleOnChange }
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
  values: PropTypes.object
};

export default GraphicFilesForm;
