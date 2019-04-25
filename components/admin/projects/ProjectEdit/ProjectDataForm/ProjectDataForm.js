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
import { withRouter } from 'next/router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { withFormik } from 'formik';
import ProjectVisibilityDropdown from 'components/admin/dropdowns/ProjectVisibilityDropdown';
import CategoryDropdown from 'components/admin/dropdowns/CategoryDropdown';
import UserDropdown from 'components/admin/dropdowns/UserDropdown';
import { CURRENT_USER_QUERY } from 'components/User/User';
import { validationSchema } from './validationSchema';
import './ProjectDataForm.scss';

const VIDEO_PROJECT_QUERY = gql`
  query VIDEO_PROJECT_QUERY( $id: ID! ) {
    videoProject( id: $id ) {
      projectTitle
      descPublic
      descInternal 
      status
      visibility
      categories {
        id
      }
      tags {
        id
      }
    }
}
`;

const CREATE_VIDEO_PROJECT_MUTATION = gql`
  mutation CREATE_VIDEO_PROJECT_MUTATION( $data: VideoProjectCreateInput! ) {
    createVideoProject( data: $data ) {
      id
    }
}
`;

const ProjectDataForm = props => {
  const {
    values,
    errors,
    touched,
    status,
    handleSubmit,
    handleChange,
    setFieldValue,
    isSubmitting,
    isValid,
    setFieldTouched,
    maxCategories
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
                <Form.Field
                  id="tags"
                  control={ Input }
                  label="Tags"
                  name="tags"
                  value={ values.tags }
                  onChange={ handleChange }
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
  handleSubmit: PropTypes.func,
  handleChange: PropTypes.func,
  values: PropTypes.object,
  errors: PropTypes.object,
  touched: PropTypes.object,
  status: PropTypes.string,
  setFieldValue: PropTypes.func,
  isSubmitting: PropTypes.bool,
  isValid: PropTypes.bool,
  setFieldTouched: PropTypes.func,
  maxCategories: PropTypes.number,
};


// what happens if there is a project id but it returns an error?
export default compose(
  withRouter,
  graphql( CURRENT_USER_QUERY, { name: 'user' } ), // only run on create
  graphql( VIDEO_PROJECT_QUERY, {
    name: 'project',
    skip: props => !props.id,
    options: props => ( {
      variables: {
        id: props.id
      },
    } )
  } ),
  graphql( CREATE_VIDEO_PROJECT_MUTATION, { name: 'createVideoProject' } ),

  // use formik to make validation easier
  withFormik( {
    // set initial form values, either from current project or from default values if new project
    mapPropsToValues: props => {
      const { user: { authenticatedUser }, project } = props;
      const videoProject = ( project && project.videoProject ) ? project.videoProject : {};

      const categories = videoProject.categories
        ? videoProject.categories.map( category => category.id )
        : [];

      return {
        author: videoProject.author || authenticatedUser.id,
        team: videoProject.team ? videoProject.team.name : authenticatedUser.team.name,
        projectTitle: videoProject.projectTitle || '',
        visibility: videoProject.visibility || '',
        categories,
        tags: videoProject.tags || [],
        descPublic: videoProject.descPublic || '',
        descInternal: videoProject.descInternal || '',
        termsConditions: false
      };
    },

    // schema to validate against
    validationSchema,

    // handle form submission
    handleSubmit: async ( values, {
      props: {
        updateNotification, createVideoProject, handleUpload, user, router
      }, setSubmitting, setErrors, setStatus
    } ) => {
      // 1. let user know systme is saving
      updateNotification( 'Saving project...' );

      // 2. Do an initial save.  Upon successful save, system will return a project id
      try {
        const res = await createVideoProject( {
          variables: {
            data: {
              projectTitle: values.projectTitle.trimEnd(),
              projectType: 'language',
              descPublic: values.descPublic.trimEnd(),
              descInternal: values.descInternal.trimEnd(),
              visibility: values.visibility,
              author: {
                connect: {
                  id: values.author
                }
              },
              team: {
                connect: {
                  id: user.authenticatedUser.team.id
                }
              },
              categories: {
                connect: values.categories.map( category => ( { id: category } ) )
              },
              tags: {
                connect: values.tags.map( tag => ( { id: tag.id } ) )
              }
            }
          }
        } );

        // 3. Use formik handled to update status to hide submit button upon project creation
        //    Button only appears for project creation
        setStatus( 'CREATED' );

        // 4. Append the new project id to the current url to idicate we are no longer
        //    in a 'create' status
        const path = `${router.asPath}&id=${res.data.createVideoProject.id}`;
        router.replace( router.asPath, path, { shallow: true } );

        // 5. Start upload of files.
        handleUpload( res.data.createVideoProject.id );
      } catch ( err ) {
        setErrors( {
          submit: err
        } );
      }

      setSubmitting( false );
    }
  } )
)( ProjectDataForm );
