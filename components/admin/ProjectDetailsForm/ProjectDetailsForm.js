/**
 *
 * ProjectDetailsForm
 *
 */
import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Grid,
  Input,
  TextArea
} from 'semantic-ui-react';
import VisibilityDropdown from 'components/admin/dropdowns/VisibilityDropdown/VisibilityDropdown';
import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown/CategoryDropdown';
import UserDropdown from 'components/admin/dropdowns/UserDropdown/UserDropdown';
import TagDropdown from 'components/admin/dropdowns/TagDropdown/TagDropdown';
import TermsConditions from 'components/admin/TermsConditions/TermsConditions';
import FormikAutoSave from 'components/admin/FormikAutoSave/FormikAutoSave';
import './ProjectDetailsForm.scss';

import isEmpty from 'lodash/isEmpty';

/**
 * Form component only.  Form is wrapped in specifc content type HOC to handle
 * queries, validation, etc
 * @param {object} props
 */
const ProjectDetailsForm = props => {
  const {
    values,
    errors,
    touched,
    handleSubmit,
    handleChange,
    setFieldValue,
    isValid,
    setFieldTouched,
    maxCategories,
    status,
    save,
    config
  } = props;

  // Is this a newly created project? Used for conditionally disabling "Save draft & upload.." button - ln. 208
  const initProjectCreation = isEmpty( touched );

  const handleOnChange = ( e, {
    name, value, type, checked
  } ) => {
    if ( type === 'checkbox' ) {
      setFieldValue( name, checked );
    } else {
      setFieldValue( name, value );
    }
    setFieldTouched( name, true, false );
  };

  return (
    <Fragment>
      { /* Only use autosave with exisiting project */ }
      { props.id && <FormikAutoSave save={ save } /> }
      <Form className="edit-project__form project-data" onSubmit={ handleSubmit }>
        <Grid stackable>
          <Grid.Row>
            <Grid.Column width="16">
              <h2 className="heading">
                <span className="uppercase">
                  { config?.headline || 'Project Data' }
                </span>
                <br />
                <small className="msg--required">Required Fields *</small>
              </h2>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 8 }>

              <Form.Group widths="equal">
                { config.projectTitle
                  && (
                    <div className="field">
                      <Form.Field
                        id="projectTitle"
                        name="projectTitle"
                        control={ Input }
                        label={ config.projectTitle?.label || 'Project Title' }
                        { ...( config.projectTitle?.required && { required: true } ) }
                        autoFocus
                        value={ values.projectTitle }
                        onChange={ handleOnChange }
                        error={ touched.projectTitle && !!errors.projectTitle }
                      />
                      <p className="error-message">{ touched.projectTitle ? errors.projectTitle : '' }</p>
                    </div>
                  ) }

                { config.visibility
                  && (
                    <div className="field">
                      <div className="field">
                        <VisibilityDropdown
                          id="visibility"
                          name="visibility"
                          label={ config.visibility?.label || 'Visibility Setting' }
                          value={ values.visibility }
                          onChange={ handleOnChange }
                          error={ touched.visibility && !!errors.visibility }
                          { ...( config.visibility?.required && { required: true } ) }
                          hide="internal"
                        />
                      </div>
                      <p className="error-message">{ touched.visibility ? errors.visibility : '' }</p>
                    </div>
                  ) }
              </Form.Group>

              <Form.Group widths="equal">
                { config.author
                  && (
                    <UserDropdown
                      id="author"
                      name="author"
                      label={ config.author?.label || 'Author' }
                      value={ values.author }
                      { ...( config.author?.required && { required: true } ) }
                      onChange={ handleOnChange }
                    />
                  ) }

                { config.team
                  && (
                    <Form.Field
                      id="team"
                      control={ Input }
                      label={ config.team?.label || 'Team' }
                      placeholder=""
                      name="team"
                      { ...( config.team?.required && { required: true } ) }
                      value={ values.team }
                    />
                  ) }

                { config.copyright
                  && (
                    <div className="field">
                      <Form.Field
                        id="copyright"
                        control={ Input }
                        label={ config.copyright?.label || 'Copyright' }
                        placeholder=""
                        name="copyright"
                        value={ values.copyright }
                        onChange={ handleOnChange }
                        { ...( config.copyright?.required && { required: true } ) }
                      />
                      <p className="error-message">{ touched.copyright ? errors.copyright : '' }</p>
                    </div>
                  ) }
              </Form.Group>

              <Form.Group widths="equal">
                { config.categories
                  && (
                    <div className="field">
                      <CategoryDropdown
                        id="categories"
                        name="categories"
                        label={ config.categories?.label || 'Categories' }
                        value={ values.categories }
                        onChange={ handleOnChange }
                        error={ touched.categories && ( !values.categories.length || values.categories.length > 2 ) }
                        multiple
                        search
                        closeOnBlur
                        closeOnChange
                        { ...( config.categories?.required && { required: true } ) }
                      />

                      { errors.categories
                        ? <p className="error-message">{ touched.categories ? errors.categories : '' }</p>
                        : <p className="field__helper-text">Select up to { maxCategories }.</p> }
                    </div>
                  ) }

                { config.tags
                  && (
                    <div className="field">
                      <TagDropdown
                        id="tags"
                        label={ config.tags?.label || 'Tags' }
                        name="tags"
                        locale="en-us"
                        value={ values.tags }
                        onChange={ handleOnChange }
                        { ...( config.tags?.required && { required: true } ) }
                      />
                      <p className="field__helper-text">Enter keywords separated by commas to search available tags.</p>
                    </div>
                  ) }
              </Form.Group>
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 8 }>
              { config.descPublic
                && (
                  <Form.Field
                    id="descPublic"
                    name="descPublic"
                    control={ TextArea }
                    label={ config.descPublic?.label || 'Public Description' }
                    value={ values.descPublic }
                    onChange={ handleChange }
                    { ...( config.descPublic?.required && { required: true } ) }
                  />
                ) }

              { config.descInternal
                && (
                  <div className="field">
                    <Form.Field
                      className="with-helper-text"
                      id="descInternal"
                      name="descInternal"
                      control={ TextArea }
                      label={ config.descInternal?.label || 'Internal Description' }
                      value={ values.descInternal }
                      onChange={ handleChange }
                      { ...( config.descInternal?.required && { required: true } ) }
                    />
                    <p className="field__helper-text">
                      Share with DoS colleagues reasons for this project as it relates to Department objectives,
                      best practices for using the project, or any other notes you would like to keep internal.
                    </p>
                  </div>
                ) }

              { config.alt
                && (
                  <div className="field">
                    <Form.Field
                      className="with-helper-text"
                      id="alt"
                      name="alt"
                      control={ TextArea }
                      label={ config.alt?.label || 'Alt (Alternative) Text' }
                      value={ values.alt }
                      onChange={ handleChange }
                      { ...( config.alt?.required && { required: true } ) }
                    />
                    <p className="field__helper-text">
                      This text helps screen-reading tools describe images to visually impaired readers.
                    </p>
                  </div>
                ) }
            </Grid.Column>
          </Grid.Row>

          { !props.id && status !== 'CREATED'
          && (
            <Grid.Row reversed="computer">
              <Grid.Column mobile={ 11 }>
                <TermsConditions
                  handleOnChange={ handleOnChange }
                  error={ touched.termsConditions && !!errors.termsConditions }
                />
              </Grid.Column>
              <Grid.Column mobile={ 16 } computer={ 5 }>
                <Button
                  type="submit"
                  onClick={ handleSubmit }
                  className="edit-project__form--save"
                  content="Save draft & upload files to this project"
                  disabled={ !isValid || initProjectCreation }
                />
              </Grid.Column>
            </Grid.Row>
          ) }
        </Grid>
      </Form>
    </Fragment>
  );
};

ProjectDetailsForm.propTypes = {
  id: PropTypes.string,
  config: PropTypes.object,
  status: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  isValid: PropTypes.bool,
  setFieldTouched: PropTypes.func,
  maxCategories: PropTypes.number,
  save: PropTypes.func
};

export default ProjectDetailsForm;
