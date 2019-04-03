/**
 *
 * ProjectDataForm
 *
 */

import React from 'react';
import {
  array,
  bool,
  func,
  number,
  oneOfType,
  string
} from 'prop-types';
import {
  Button,
  Dropdown,
  Form,
  Grid,
  Input,
  Select,
  TextArea
} from 'semantic-ui-react';
import Link from 'next/link';

import './ProjectDataForm.scss';

const ProjectDataForm = props => {
  const {
    handleSubmit,
    handleChange,
    videoTitle,
    visibilityOptions,
    visibility,
    authorValue,
    teamValue,
    categoryLabel,
    maxCategories,
    categoryOptions,
    hasExceededMaxCategories,
    categoriesValue,
    tagsValue,
    descPublicValue,
    descInternalValue,
    termsConditions,
    hasSubmittedData,
    hasRequiredData
  } = props;

  return (
    <Form className="edit-project__form project-data" onSubmit={ handleSubmit }>
      <Grid stackable>
        <Grid.Row>
          <Grid.Column width="16">
            <h3 className="heading">
              <span className="uppercase">Project Data</span>
              <br />
              <small className="msg--required">Required Fields *</small>
            </h3>
          </Grid.Column>
        </Grid.Row>

        <Grid.Row>
          <Grid.Column mobile={ 16 } computer={ 8 }>
            <Form.Group widths="equal">
              <Form.Field
                id="video-title"
                control={ Input }
                label="Video Title"
                required
                autoFocus
                name="projectTitle"
                value={ videoTitle }
                onChange={ handleChange }
                error={ !videoTitle }
              />

              <Form.Field
                id="visibility-setting"
                control={ Select }
                label="Visibility Setting"
                options={ visibilityOptions }
                required
                name="visibility"
                value={ visibility }
                onChange={ handleChange }
                error={ !visibility }
              />
            </Form.Group>

            <Form.Group widths="equal">
              <Form.Field
                id="author"
                control={ Input }
                label="Author"
                placeholder="Jane Doe"
                name="author"
                value={ authorValue }
                onChange={ handleChange }
              />

              <Form.Field
                id="team"
                control={ Input }
                label="Team"
                placeholder="IIP Video Production"
                name="team"
                value={ teamValue }
                onChange={ handleChange }
              />
            </Form.Group>

            <Form.Group widths="equal">
              <div className="field">
                <Form.Dropdown
                  id="video-categories"
                  control={ Dropdown }
                  label={ categoryLabel }
                  required
                  placeholder="-"
                  options={ categoryOptions }
                  fluid
                  multiple
                  search
                  selection
                  closeOnBlur
                  closeOnChange
                  name="categories"
                  value={ categoriesValue }
                  onChange={ handleChange }
                  error={
                    !categoriesValue.length > 0 || hasExceededMaxCategories
                  }
                  style={ { marginBottom: '1em' } }
                />
                <p>Select up to { maxCategories }.</p>
              </div>

              <div className="field">
                <Form.Field
                  id="video-tags"
                  control={ Input }
                  label="Tags"
                  name="tags"
                  value={ tagsValue }
                  onChange={ handleChange }
                  style={ { marginBottom: '1em' } }
                />
                <p>Enter keywords separated by commas.</p>
              </div>
            </Form.Group>
          </Grid.Column>

          <Grid.Column mobile={ 16 } computer={ 8 }>
            <Form.Field
              id="public-description"
              control={ TextArea }
              label="Public Description"
              name="descPublic"
              value={ descPublicValue }
              onChange={ handleChange }
            />

            <div className="field">
              <Form.Field
                id="internal-description"
                control={ TextArea }
                label="Internal Description"
                name="descInternal"
                value={ descInternalValue }
                onChange={ handleChange }
              />
              <p>Reason for this project as it relates to Department objectives.</p>
            </div>
          </Grid.Column>
        </Grid.Row>

        { !hasSubmittedData
          && (
            <Grid.Row reversed="computer">
              <Grid.Column mobile={ 11 }>
                <Form.Checkbox
                  id="terms-conditions"
                  label={ (
                    /* eslint-disable jsx-a11y/label-has-for */
                    /* eslint-disable jsx-a11y/label-has-associated-control */
                    <label htmlFor="terms-conditions">
                      By uploading these files I agree to the Content Commons <Link href="/about"><a>Terms of Use</a></Link> and licensing agreements. I understand that my content will be available to the public for general use.
                    </label>
                  ) }
                  name="termsConditions"
                  type="checkbox"
                  required
                  checked={ termsConditions }
                  onChange={ handleChange }
                  error={ !termsConditions }
                />
              </Grid.Column>
              <Grid.Column mobile={ 16 } computer={ 5 }>
                <Button
                  className="edit-project__form--save"
                  content="Save draft & upload files to this project"
                  disabled={ !hasRequiredData }
                />
              </Grid.Column>
            </Grid.Row>
          ) }
      </Grid>
    </Form>
  );
};

ProjectDataForm.propTypes = {
  handleSubmit: func,
  handleChange: func,
  videoTitle: string,
  visibilityOptions: array,
  visibility: string,
  authorValue: string,
  teamValue: string,
  categoryLabel: string,
  maxCategories: number,
  categoryOptions: array,
  hasExceededMaxCategories: bool,
  categoriesValue: array,
  tagsValue: oneOfType( [array, string] ),
  descPublicValue: string,
  descInternalValue: string,
  termsConditions: bool,
  hasSubmittedData: bool,
  hasRequiredData: bool
};

export default ProjectDataForm;
