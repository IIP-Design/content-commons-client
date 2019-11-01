/**
 *
 * VideoProjectDetailsForm
 *
 */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { withRouter } from 'next/router';
import { connect } from 'react-redux';
import * as reduxActions from 'lib/redux/actions/projectUpdate';
import {
  CREATE_VIDEO_PROJECT_MUTATION,
  UPDATE_VIDEO_PROJECT_MUTATION,
  VIDEO_PROJECT_FORM_QUERY
} from 'lib/graphql/queries/video';
import { CURRENT_USER_QUERY } from 'components/User/User';
import { compose, graphql } from 'react-apollo';
import { buildCreateVideoProjectTree, buildFormTree } from 'lib/graphql/builders/video';
import { Formik } from 'formik';

import ProjectDetailsForm from 'components/admin/ProjectDetailsForm/ProjectDetailsForm';
import Notification from 'components/Notification/Notification';

import useTimeout from 'lib/hooks/useTimeout';
import { initialSchema, baseSchema } from './validationSchema';

// import { withApollo } from 'react-apollo';
// import { useApolloClient } from 'react-apollo-hooks';

const VideoProjectDetailsForm = props => {
  // const client = useApolloClient();
  // console.log( client )

  const [showNotication, setShowNotification] = useState( false );

  const hideNotification = () => {
    setShowNotification( false );
  };

  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const update = async ( values, prevValues ) => {
    const { id, updateVideoProject } = props;
    if ( id ) { // ensure we have a project
      await updateVideoProject( {
        variables: {
          data: buildFormTree( values, prevValues ),
          where: { id }
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );
    setShowNotification( true );

    // Notify redux state that Project updated, indexed by project id
    // Used for conditionally displaying Publish buttons & msgs (bottom of screen) on VideoReview
    const { id, projectUpdated } = props;
    projectUpdated( id, true );

    startTimeout();
  };

  const getInitialValues = () => {
    const { user: { authenticatedUser }, data } = props;

    const videoProject = ( data && data.projectForm ) ? data.projectForm : {};

    const categories = videoProject.categories
      ? videoProject.categories.map( category => category.id )
      : [];

    const tags = videoProject.tags
      ? videoProject.tags.map( tag => tag.id )
      : [];

    const author = videoProject.author ? videoProject.author.id : authenticatedUser.id;

    const initialValues = {
      author,
      team: videoProject.team ? videoProject.team.name : authenticatedUser.team.name,
      projectTitle: videoProject.projectTitle || '',
      visibility: videoProject.visibility || 'PUBLIC',
      categories,
      tags,
      descPublic: videoProject.descPublic || '',
      descInternal: videoProject.descInternal || '',
      termsConditions: false
    };

    return initialValues;
  };

  const onHandleSubmit = async ( values, actions ) => {
    const {
      user, createVideoProject, updateNotification, handleUpload
    } = props;
    const { setStatus, setErrors, setSubmitting } = actions;

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
      handleUpload( res.data.createVideoProject, values.tags );
    } catch ( err ) {
      setErrors( {
        submit: err
      } );
    }

    setSubmitting( false );
  };

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ props.id ? baseSchema : initialSchema }
      onSubmit={ onHandleSubmit }
      render={ formikProps => (
        <Fragment>
          <Notification
            el="p"
            customStyles={ {
              position: 'absolute',
              top: '9em',
              left: '50%',
              transform: 'translateX(-50%)'
            } }
            show={ showNotication }
            msg="Changes saved"
          />
          <ProjectDetailsForm
            { ...formikProps }
            { ...props }
            save={ save }
          />
        </Fragment>
      ) }
    />
  );
};

VideoProjectDetailsForm.propTypes = {
  id: PropTypes.string,
  user: PropTypes.object,
  data: PropTypes.object,
  createVideoProject: PropTypes.func,
  updateNotification: PropTypes.func,
  handleUpload: PropTypes.func,
  updateVideoProject: PropTypes.func,
  projectUpdated: PropTypes.func
};

export default compose(
  withRouter,
  connect( null, reduxActions ),
  graphql( CURRENT_USER_QUERY, { name: 'user' } ), // only run on create
  graphql( CREATE_VIDEO_PROJECT_MUTATION, { name: 'createVideoProject' } ),
  graphql( UPDATE_VIDEO_PROJECT_MUTATION, { name: 'updateVideoProject' } ),
  graphql( VIDEO_PROJECT_FORM_QUERY, {
    partialRefetch: true,
    skip: props => !props.id
  } )
)( VideoProjectDetailsForm );
