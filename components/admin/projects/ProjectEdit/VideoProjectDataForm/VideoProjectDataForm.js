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

const VIDEO_PROJECT_FORM_QUERY = gql`
  query VIDEO_PROJECT_FORM_QUERY( $id: ID! ) {
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
      projectTitle
    }
}
`;

// what happens if there is a project id but it returns an error?
export default compose(
  withRouter,
  graphql( CURRENT_USER_QUERY, { name: 'user' } ), // only run on create
  graphql( VIDEO_PROJECT_FORM_QUERY, {
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
        visibility: videoProject.visibility || 'PUBLIC',
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
                connect: values.tags.map( tag => ( { id: tag.id } ) )
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
