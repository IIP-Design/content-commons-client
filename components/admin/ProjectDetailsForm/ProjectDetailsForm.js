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
    isSubmitting,
    isValid,
    setFieldTouched,
    maxCategories,
    status,
    save
  } = props;

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
                <span className="uppercase">Project Data</span>
                <br />
                <small className="msg--required">Required Fields *</small>
              </h2>
            </Grid.Column>
          </Grid.Row>

          <Grid.Row>
            <Grid.Column mobile={ 16 } computer={ 8 }>

              <Form.Group widths="equal">
                <div className="field">
                  <Form.Field
                    id="projectTitle"
                    name="projectTitle"
                    control={ Input }
                    label="Project Title"
                    required
                    autoFocus
                    value={ values.projectTitle }
                    onChange={ handleOnChange }
                    error={ touched.projectTitle && !!errors.projectTitle }
                  />
                  <p className="error-message">{ touched.projectTitle ? errors.projectTitle : '' }</p>
                </div>

                <div className="field">
                  <div className="field">
                    <VisibilityDropdown
                      id="visibility"
                      name="visibility"
                      label="Visibility Setting"
                      value={ values.visibility }
                      onChange={ handleOnChange }
                      error={ touched.visibility && !!errors.visibility }
                      required
                      hide="internal"
                    />
                  </div>
                  <p className="error-message">{ touched.visibility ? errors.visibility : '' }</p>
                </div>
              </Form.Group>

              <Form.Group widths="equal">
                <UserDropdown
                  id="author"
                  name="author"
                  label="Author"
                  value={ values.author }
                  onChange={ handleOnChange }
                />

                <Form.Field
                  id="team"
                  control={ Input }
                  label="Team"
                  placeholder=""
                  name="team"
                  value={ values.team }
                />
              </Form.Group>

              <Form.Group widths="equal">
                <div className="field">
                  <CategoryDropdown
                    id="categories"
                    name="categories"
                    label="Categories"
                    value={ values.categories }
                    onChange={ handleOnChange }
                    error={ !values.categories.length || values.categories.length > 2 }
                    multiple
                    search
                    closeOnBlur
                    closeOnChange
                    required
                  />

                  { errors.categories
                    ? <p className="error-message">{ touched.categories ? errors.categories : '' }</p>
                    : <p className="field__helper-text">Select up to { maxCategories }.</p> }
                </div>

                <div className="field">
                  <TagDropdown
                    id="tags"
                    label="Tags"
                    name="tags"
                    locale="en-us"
                    value={ values.tags }
                    onChange={ handleOnChange }
                  />
                  <p className="field__helper-text">Enter keywords separated by commas to search available tags.</p>
                </div>
              </Form.Group>
            </Grid.Column>

            <Grid.Column mobile={ 16 } computer={ 8 }>
              <Form.Field
                id="descPublic"
                name="descPublic"
                control={ TextArea }
                label="Public Description"
                value={ values.descPublic }
                onChange={ handleChange }
              />

              <div className="field">
                <Form.Field
                  className="with-helper-text"
                  id="descInternal"
                  name="descInternal"
                  control={ TextArea }
                  label="Internal Description"
                  value={ values.descInternal }
                  onChange={ handleChange }
                />
                <p className="field__helper-text">
                  Share with DoS colleagues reasons for this project as it relates to Department objectives,
                  best practices for using the project, or any other notes you would like to keep internal.
                </p>
              </div>
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
                  disabled={ !isValid || isSubmitting }
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
  status: PropTypes.string,
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  setFieldValue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  setFieldTouched: PropTypes.func,
  maxCategories: PropTypes.number,
  save: PropTypes.func,
};

export default ProjectDetailsForm;
