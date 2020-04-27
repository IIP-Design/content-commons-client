/* eslint-disable react/destructuring-assignment */
import React, { Fragment, useState } from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { useAuth } from 'context/authContext';
import { CREATE_GRAPHIC_PROJECT_MUTATION, UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildCreateGraphicProjectTree, buildFormTree } from 'lib/graphql/builders/graphic';
import { Formik } from 'formik';

import ProjectDetailsForm from 'components/admin/ProjectDetailsForm/ProjectDetailsForm';
import Notification from 'components/Notification/Notification';

import useTimeout from 'lib/hooks/useTimeout';
import { initialSchema, baseSchema } from './validationSchema';

const GraphicProjectDetailsFormContainer = props => {
  const { setIsFormValid } = props;
  const { user } = useAuth();

  const [createGraphicProject] = useMutation( CREATE_GRAPHIC_PROJECT_MUTATION );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const [showNotification, setShowNotification] = useState( false );

  const hideNotification = () => {
    setShowNotification( false );
  };

  const { startTimeout } = useTimeout( hideNotification, 1000 );

  const update = async ( values, prevValues ) => {
    const { id } = props;

    if ( id ) {
      // ensure we have a project
      await updateGraphicProject( {
        variables: {
          data: buildFormTree( values, prevValues ),
          where: { id }
        }
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async ( values, prevValues ) => {
    await update( values, prevValues );

    if ( !showNotification ) {
      setShowNotification( true );
    }

    // Notify redux state that Project updated, indexed by project id
    // Used for conditionally displaying Publish buttons & msgs (bottom of screen) on VideoReview
    // const { id, projectUpdated } = props;
    // projectUpdated( id, true );

    startTimeout();
  };

  const getInitialValues = () => {
    const graphicProject = props?.data?.graphicProject || {};

    const categories = graphicProject.categories
      ? graphicProject.categories.map( category => category.id )
      : [];

    const tags = graphicProject.tags ? graphicProject.tags.map( tag => tag.id ) : [];

    const initialValues = {
      projectTitle: graphicProject.title || '',
      visibility: graphicProject.visibility || 'PUBLIC',
      team: graphicProject.team ? graphicProject.team.name : user?.team?.name,
      copyright: graphicProject.copyright || '',
      categories,
      tags,
      descPublic: graphicProject.descPublic || '',
      descInternal: graphicProject.descInternal || '',
      alt: graphicProject.alt || ''
    };

    return initialValues;
  };

  const onHandleSubmit = async ( values, actions ) => {
    const { updateNotification, handleUpload } = props;
    const { setStatus, setErrors, setSubmitting } = actions;

    // 1. let user know system is saving
    updateNotification( 'Saving project...' );

    // 2. Do an initial save.  Upon successful save, system will return a project id
    try {
      const res = await createGraphicProject( {
        variables: {
          data: buildCreateGraphicProjectTree( user, values )
        }
      } );

      // 3. Use formik handled to update status to hide submit button upon project creation
      //    Button only appears for project creation
      setStatus( 'CREATED' );

      // 4. Start upload of files. (if there are files to upload)
      handleUpload( res.data.createGraphicProject, values.tags );
    } catch ( err ) {
      setErrors( {
        submit: err
      } );
    }

    setSubmitting( false );
  };

  const renderContent = formikProps => {
    setIsFormValid( formikProps.isValid );
    const config = {
      headline: 'Social Media Graphics Project Data',
      projectTitle: {
        label: 'Project Name',
        required: true
      },
      visibility: {
        label: 'Visibility Setting',
        required: true
      },
      team: {
        label: 'Source',
        required: false
      },
      copyright: {
        label: 'Copyright',
        required: true
      },
      categories: {
        label: 'Categories',
        required: true
      },
      tags: {
        label: 'Tags',
        required: false
      },
      descPublic: {
        label: 'Public Description',
        required: false
      },
      descInternal: {
        label: 'Internal Description',
        required: false
      },
      alt: {
        label: 'Alt (Alternative) Text',
        required: false
      }
    };

    return (
      <Fragment>
        <Notification
          el="p"
          customStyles={ {
            position: 'absolute',
            top: '9em',
            left: '50%',
            transform: 'translateX(-50%)'
          } }
          show={ showNotification }
          msg="Changes saved"
        />
        <ProjectDetailsForm
          { ...formikProps }
          { ...props }
          config={ config }
          save={ save }
        />
      </Fragment>
    );
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

GraphicProjectDetailsFormContainer.propTypes = {
  id: PropTypes.string,
  data: PropTypes.object,
  updateNotification: PropTypes.func,
  handleUpload: PropTypes.func,
  setIsFormValid: PropTypes.func
};

export default GraphicProjectDetailsFormContainer;
