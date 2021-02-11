/* eslint-disable react/destructuring-assignment */
/**
 *
 * VideoProjectDetailsForm
 *
 */
import React from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import * as reduxActions from 'lib/redux/actions/projectUpdate';
import { useAuth } from 'context/authContext';
import {
  CREATE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_FORM_QUERY,
} from 'lib/graphql/queries/video';
import { graphql } from 'react-apollo';
import compose from 'lodash.flowright';
import { buildCreateVideoProjectTree, buildFormTree } from 'lib/graphql/builders/video';
import { Formik } from 'formik';

import ProjectDetailsForm from 'components/admin/ProjectDetailsForm/ProjectDetailsForm';

import { initialSchema, baseSchema } from './validationSchema';

const VideoProjectDetailsForm = props => {
  const {
    setIsFormValid,
    updateNotification,
    startTimeout,
    createVideoProject,
    handleUpload,
  } = props;
  const { user } = useAuth();

  const update = async ( values, prevValues ) => {
    const { id, updateVideoProject } = props;

    if ( id ) {
      // ensure we have a project
      await updateVideoProject( {
        variables: {
          data: buildFormTree( values, prevValues ),
          where: { id },
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );

    updateNotification( 'Changes saved' );
    startTimeout();

    // Notify redux state that Project updated, indexed by project id
    // Used for conditionally displaying Publish buttons & msgs (bottom of screen) on VideoReview
    const { id, projectUpdated } = props;

    projectUpdated( id, true );
  };

  const getInitialValues = () => {
    const { data } = props;
    const videoProject = data && data.projectForm ? data.projectForm : {};

    const categories = videoProject.categories
      ? videoProject.categories.map( category => category.id )
      : [];

    const tags = videoProject.tags ? videoProject.tags.map( tag => tag.id ) : [];

    const author = videoProject.author ? videoProject.author.id : user?.id;

    const initialValues = {
      author,
      team: videoProject.team ? videoProject.team.name : user?.team?.name,
      projectTitle: videoProject.projectTitle || '',
      visibility: videoProject.visibility || 'PUBLIC',
      categories,
      tags,
      descPublic: videoProject.descPublic || '',
      descInternal: videoProject.descInternal || '',
      termsConditions: false,
    };

    return initialValues;
  };

  const onHandleSubmit = async ( values, actions ) => {
    const { setStatus, setErrors, setSubmitting } = actions;

    // 1. let user know system is saving
    updateNotification( 'Saving project...' );

    // 2. Do an initial save.  Upon successful save, system will return a project id
    try {
      const res = await createVideoProject( {
        variables: {
          data: buildCreateVideoProjectTree( user, values ),
        },
      } );

      // 3. Use formik handled to update status to hide submit button upon project creation
      //    Button only appears for project creation
      setStatus( 'CREATED' );

      // 4. Start upload of files. (if there are files to upload)
      handleUpload( res.data.createVideoProject, values.tags );
    } catch ( err ) {
      setErrors( {
        submit: err,
      } );
    }

    setSubmitting( false );
  };

  const renderContent = formikProps => {
    setIsFormValid( formikProps.isValid );
    const config = {
      headline: 'Project Data',
      projectTitle: {
        label: 'Project Title',
        required: true,
      },
      visibility: {
        label: 'Visibility Setting',
        required: true,
      },
      author: {
        label: 'Author',
        required: false,
      },
      team: {
        label: 'Team',
        required: false,
      },
      categories: {
        label: 'Categories',
        required: true,
      },
      tags: {
        label: 'Tags',
        required: false,
      },
      descPublic: {
        label: 'Public Description',
        required: false,
      },
      descInternal: {
        label: 'Internal Description',
        required: false,
      },
    };

    return <ProjectDetailsForm { ...formikProps } { ...props } config={ config } save={ save } />;
  };

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ props.id ? baseSchema : initialSchema }
      onSubmit={ onHandleSubmit }
    >
      { renderContent }
    </Formik>
  );
};

VideoProjectDetailsForm.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  createVideoProject: PropTypes.func,
  updateNotification: PropTypes.func,
  handleUpload: PropTypes.func,
  updateVideoProject: PropTypes.func,
  projectUpdated: PropTypes.func,
  setIsFormValid: PropTypes.func,
  startTimeout: PropTypes.func,
};

export default compose(
  withRouter,
  connect( null, reduxActions ),
  graphql( CREATE_VIDEO_PROJECT_MUTATION, { name: 'createVideoProject' } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( VIDEO_PROJECT_FORM_QUERY, {
    partialRefetch: true,
    skip: props => !props.id,
  } ),
)( VideoProjectDetailsForm );
