/**
 *
 * VideoProjectDataForm
 *
 */
import { withRouter } from 'next/router';
import { compose, graphql } from 'react-apollo';
import { CURRENT_USER_QUERY } from 'components/User/User';
import ProjectDataForm from 'components/admin/projects/ProjectEdit/ProjectDataForm/ProjectDataForm';
import { withFormik } from 'formik';
import {
  CREATE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_FORM_QUERY
} from 'lib/graphql/queries/video';
import { buildCreateVideoProjectTree } from 'lib/graphql/builders/video';
import { validationSchema } from './validationSchema';

// what happens if there is a project id but it returns an error?
export default compose(
  withRouter,
  graphql( CURRENT_USER_QUERY, { name: 'user' } ), // only run on create
  graphql( CREATE_VIDEO_PROJECT_MUTATION, { name: 'createVideoProject' } ),
  graphql( VIDEO_PROJECT_FORM_QUERY, {
    partialRefetch: true,
    skip: props => !props.id
  } ),

  // use formik to make validation easier
  withFormik( {
    // set initial form values, either from current project or from default values if new project
    // data param coming from context in pages/admin/project, passed in as prop
    mapPropsToValues: props => {
      const { user: { authenticatedUser }, data } = props;

      const videoProject = ( data && data.projectForm ) ? data.projectForm : {};

      const categories = videoProject.categories
        ? videoProject.categories.map( category => category.id )
        : [];

      const tags = videoProject.tags
        ? videoProject.tags.map( tag => tag.id )
        : [];

      return {
        author: videoProject.author || authenticatedUser.id,
        team: videoProject.team ? videoProject.team.name : authenticatedUser.team.name,
        projectTitle: videoProject.projectTitle || '',
        visibility: videoProject.visibility || 'PUBLIC',
        categories,
        tags,
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
        updateNotification, createVideoProject, handleUpload, user
      }, setSubmitting, setErrors, setStatus
    } ) => {
      // 1. let user know system is saving
      updateNotification( 'Saving project...' );

      // 2. Do an initial save.  Upon successful save, system will return a project id
      try {
        const res = await createVideoProject( {
          variables: {
            data: buildCreateVideoProjectTree( user, values )
          }
        } );

        // 3. Use formik handled to update status to hide submit button upon project creation
        //    Button only appears for project creation
        setStatus( 'CREATED' );

        // 4. Start upload of files. (if there are files to upload)
        handleUpload( res.data.createVideoProject );
      } catch ( err ) {
        setErrors( {
          submit: err
        } );
      }

      setSubmitting( false );
    }
  } )
)( ProjectDataForm );
