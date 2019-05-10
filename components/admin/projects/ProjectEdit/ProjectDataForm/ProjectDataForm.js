/**
 *
 * ProjectDataForm
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Form,
  Grid,
  Input,
  TextArea
} from 'semantic-ui-react';
import Link from 'next/link';
import ProjectVisibilityDropdown from 'components/admin/dropdowns/ProjectVisibilityDropdown';
import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown';
import UserDropdown from 'components/admin/dropdowns/UserDropdown';
import TagTypeahead from 'components/admin/dropdowns/TagTypeahead';

import './ProjectDataForm.scss';

/**
 * Form component only.  Form is wrapped in specifc content type HOC to handle
 * queries, validation, etc
 * @param {object} props
 */
const ProjectDataForm = props => {
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
    status
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
                  label="Video Title"
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
                  <ProjectVisibilityDropdown
                    id="visibility"
                    name="visibility"
                    label="Visibility Setting"
                    value={ values.visibility }
                    onChange={ handleOnChange }
                    error={ touched.visibility && !!errors.visibility }
                    required
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
                  error={ touched.categories && !!errors.categories }
                  multiple
                  search
                  closeOnBlur
                  closeOnChange
                  required
                  style={ { marginBottom: '1em' } }
                />

                { errors.categories
                  ? <p className="error-message">{ touched.categories ? errors.categories : '' }</p>
                  : <p>Select up to { maxCategories }.</p>
              }
              </div>

              <div className="field">
                <TagTypeahead
                  id="tags"
                  label="Tags"
                  name="tags"
                  locale="en-us"
                  value={ values.tags }
                  onChange={ handleOnChange }
                  style={ { marginBottom: '1em' } }
                />
                <p>Enter keywords separated by commas.</p>
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
                id="descInternal"
                name="descInternal"
                control={ TextArea }
                label="Internal Description"
                value={ values.descInternal }
                onChange={ handleChange }
              />
              <p>Reason for this project as it relates to Department objectives.</p>
            </div>
          </Grid.Column>
        </Grid.Row>

        { !props.id && status !== 'CREATED'
          && (
            <Grid.Row reversed="computer">
              <Grid.Column mobile={ 11 }>
                <Form.Checkbox
                  id="termsConditions"
                  name="termsConditions"
                  label={ (
                    <label htmlFor="termsConditions">
                      By uploading these files I agree to the Content Commons <Link href="/privacy"><a>Terms of Use</a></Link> and licensing agreements. I understand that my content will be available to the public for general use.
                    </label>
                  ) }
                  type="checkbox"
                  required
                  onChange={ handleOnChange }
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
  );
};

ProjectDataForm.propTypes = {
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
  maxCategories: PropTypes.number
};


// what happens if there is a project id but it returns an error?
export default ProjectDataForm;
