/**
 *
 * VideoProjectDataForm
 *
 */
import { withRouter } from 'next/router';
import { compose, graphql } from 'react-apollo';
import gql from 'graphql-tag';
import { CURRENT_USER_QUERY } from 'components/User/User';
import ProjectDataForm from 'components/admin/projects/ProjectEdit/ProjectDataForm/ProjectDataForm';
import { withFormik } from 'formik';
import { validationSchema } from './validationSchema';

const CREATE_VIDEO_PROJECT_MUTATION = gql`
  mutation CREATE_VIDEO_PROJECT_MUTATION( $data: VideoProjectCreateInput! ) {
    createVideoProject( data: $data ) {
      id
      projectTitle
    }
}
`;


// what happens if there is a project id but it returns an error?
export default compose(
  withRouter,
  graphql( CURRENT_USER_QUERY, { name: 'user' } ), // only run on create
  graphql( CREATE_VIDEO_PROJECT_MUTATION, { name: 'createVideoProject' } ),

  // use formik to make validation easier
  withFormik( {
    // set initial form values, either from current project or from default values if new project
    // data param coming from context in pages/admin/project, passed in as prop
    mapPropsToValues: props => {
      const { user: { authenticatedUser }, data } = props;
      const categories = data.categories
        ? data.categories.map( category => category.id )
        : [];

      const tags = data.tags
        ? data.tags.map( tag => tag.id )
        : [];

      return {
        author: data.author || authenticatedUser.id,
        team: data.team ? data.team.name : authenticatedUser.team.name,
        projectTitle: data.projectTitle || '',
        visibility: data.visibility || 'PUBLIC',
        categories,
        tags,
        descPublic: data.descPublic || '',
        descInternal: data.descInternal || '',
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
      // 1. let user know systme is saving
      updateNotification( 'Saving project...' );

      // 2. Do an initial save.  Upon successful save, system will return a project id
      try {
        const res = await createVideoProject( {
          variables: {
            data: {
              projectTitle: values.projectTitle.trimEnd(),
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
                connect: values.tags.map( tag => ( { id: tag } ) )
              }
            }
          }
        } );

        // 3. Use formik handled to update status to hide submit button upon project creation
        //    Button only appears for project creation
        setStatus( 'CREATED' );

        // 4. Start upload of files.
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
