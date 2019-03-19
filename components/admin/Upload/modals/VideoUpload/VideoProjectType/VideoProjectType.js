import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import { formikHandleOnChange } from 'lib/form';
import * as Yup from 'yup';
import {
  Form,
  Checkbox,
  Button
} from 'semantic-ui-react';
import './VideoProjectType.scss';

const validationSchema = Yup.object().shape( {
  projectType: Yup.string()
    .required( 'Please select a project type!' )
} );

const VideoProjectType = props => {
  const fileInput = React.createRef();

  // since we are using a stateless function, use a hook for mouunting/unmouting calls
  useEffect( () => {
    props.updateModalClassname( 'upload_modal project-type-active' );
    return () => props.updateModalClassname( 'upload_modal' );
  }, [] );

  // only open files dialogue if a projectType has been selected
  const handleOnSubmit = () => {
    fileInput.current.click();
  };

  // only called if files are selected
  const handleOnChangeFiles = e => {
    props.handleVideoAssetsUpload( e );
    props.goNext();
  };

  return (
    <Formik
      validationSchema={ validationSchema }
      validateOnBlur={ false }
      validateOnChange={ false }
      initialValues={ { projectType: 'one_video' } }
      onSubmit={ ( values, { setSubmitting } ) => {
        setSubmitting( false );
        handleOnSubmit();
      } }
      render={ ( {
        values,
        errors,
        setFieldValue,
        handleSubmit,
        isSubmitting
      } ) => {
        const handleOnChange = ( e, { name, value } ) => formikHandleOnChange( name, value, setFieldValue );

        return (
          <Form className="videoProjectType" onSubmit={ handleSubmit }>
            <Form.Field>
              <Checkbox
                radio
                name="projectType"
                label="One video with its variations and assets"
                checked={ values.projectType === 'one_video' }
                value="one_video"
                onChange={ handleOnChange }
              />
              <p>Select for importing video files and assets that are translated variations for one video.</p>
            </Form.Field>
            <Form.Field disabled>
              <Checkbox
                radio
                name="projectType"
                label="A set of videos that are related and their assets"
                checked={ values.projectType === 'multiple_video' }
                value="multiple_video"
                onChange={ handleOnChange }
              />
              <p>Select for bulk importing multiple videos that are related to each other, but not variations of the same video.</p>
            </Form.Field>
            <Form.Field disabled>
              <Checkbox
                radio
                name="projectType"
                label="Unrelated video files and their assets"
                checked={ values.projectType === 'unrelated_video' }
                value="unrelated_video"
                onChange={ handleOnChange }
              />
              <p>Select for bulk importing multiple videos that are unrelated to each other.</p>
            </Form.Field>
            <p className="error-message">{ errors.projectType }</p>
            <Form.Field className="upload_actions">
              <Button
                type="button"
                onClick={ props.closeModal }
                disabled={ isSubmitting }
                className="secondary"
              >Cancel
              </Button>
              <Button
                as="button"
                type="submit"
                disabled={ isSubmitting }
                className="primary"
              >Next
              </Button>
              { /* Hidden files dialogue box */ }
              <input
                ref={ fileInput }
                id="upload_video_assets"
                type="file"
                name="upload_video_assets"
                multiple
                onChange={ handleOnChangeFiles }
                style={ { display: 'none' } }
              />
            </Form.Field>
          </Form>
        );
      } }
    />
  );
};

VideoProjectType.propTypes = {
  closeModal: PropTypes.func,
  handleVideoAssetsUpload: PropTypes.func,
  updateModalClassname: PropTypes.func,
  goNext: PropTypes.func
};

export default VideoProjectType;
