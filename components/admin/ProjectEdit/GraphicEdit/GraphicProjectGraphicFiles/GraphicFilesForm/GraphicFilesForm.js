import React from 'react';
import PropTypes from 'prop-types';
import { Form, Input } from 'semantic-ui-react';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import GraphicStyleDropdown from 'components/admin/dropdowns/GraphicStyleDropdown/GraphicStyleDropdown';
import LanguageDropdown from 'components/admin/dropdowns/LanguageDropdown/LanguageDropdown';
import SocialPlatformDropdown from 'components/admin/dropdowns/SocialPlatformDropdown/SocialPlatformDropdown';
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

  return (
    <div className="graphic-project-graphic-files">
      { projectId && <FormikAutoSave save={ save } /> }
      <Form className="form-fields">
        { files.map( file => {
          const { id } = file;
          const value = values[id];

          return (
            <div key={ id }>
              <div className="field">
                <Form.Field
                  id={ `title-${id}` }
                  name={ `${id}.title` }
                  control={ Input }
                  label="Graphic Title"
                  value={ value.title }
                  onChange={ handleOnChange }
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
            </div>
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
