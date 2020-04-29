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
    files, projectId, save, setFieldValue, setFieldTouched, values
  } = props;

  const handleOnChange = ( e, { name, value } ) => {
    setFieldValue( name, value );
    setFieldTouched( name, true, false );
  };

  return (
    <div className="graphic-project-graphic-files">
      { projectId && <FormikAutoSave save={ save } /> }
      <Form className="form-fields">
        { files.map( file => {
          const { id } = file;

          return (
            <div key={ file.id }>
              <div className="field">
                <Form.Field
                  id={ `title-${id}` }
                  name={ `${id}.title` }
                  control={ Input }
                  label="Graphic Title"
                  value={ values[id].title }
                  onChange={ handleOnChange }
                />
              </div>

              <div className="form-group two-col">
                <LanguageDropdown
                  id={ `language-${id}` }
                  name={ `${id}.language` }
                  className="language"
                  label="Language"
                  value={ values[id].language }
                  onChange={ handleOnChange }
                  required
                />

                <GraphicStyleDropdown
                  id={ `graphic-style-${id}` }
                  name={ `${id}.style` }
                  className="graphic-style"
                  label="Style"
                  value={ values[id].style }
                  onChange={ handleOnChange }
                  required
                />
              </div>

              <SocialPlatformDropdown
                id={ `social-platform-${id}` }
                name={ `${id}.social` }
                className="social-platform"
                label="Platform"
                value={ values[id].social }
                onChange={ handleOnChange }
                required
              />
            </div>
          );
        } ) }
      </Form>
    </div>
  );
};

GraphicFilesForm.propTypes = {
  files: PropTypes.array,
  projectId: PropTypes.string,
  save: PropTypes.func,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object
};

export default GraphicFilesForm;
