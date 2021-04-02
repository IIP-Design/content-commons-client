/* eslint-disable react/destructuring-assignment */
import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { useAuth } from 'context/authContext';
import { CREATE_GRAPHIC_PROJECT_MUTATION, UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildCreateGraphicProjectTree, buildFormTree } from 'lib/graphql/builders/graphic';
import { Formik } from 'formik';
import ProjectDetailsForm from 'components/admin/ProjectDetailsForm/ProjectDetailsForm';
import { initialSchema, baseSchema } from './validationSchema';
import useTimeout from 'lib/hooks/useTimeout';
import './GraphicProjectDetailsFormContainer.scss';

const GraphicProjectDetailsFormContainer = props => {
  const {
    contentStyle,
    data,
    setIsFormValid,
    updateNotification,
    handleUpload,
  } = props;
  const { user } = useAuth();

  const [createGraphicProject] = useMutation( CREATE_GRAPHIC_PROJECT_MUTATION );
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const { startTimeout } = useTimeout( () => {
    updateNotification( '' );
  }, 1000 );

  const getInitialValues = () => {
    const graphicProject = data?.graphicProject || {};

    const categories = graphicProject.categories
      ? graphicProject.categories.map( category => category.id )
      : [];

    const tags = graphicProject.tags ? graphicProject.tags.map( tag => tag.id ) : [];

    const initialValues = {
      projectTitle: graphicProject.title || '',
      visibility: graphicProject.visibility || 'PUBLIC',
      team: graphicProject.team?.id || '',
      copyright: graphicProject.copyright || 'COPYRIGHT',
      categories,
      tags,
      descPublic: graphicProject.descPublic?.content || '',
      descInternal: graphicProject.descInternal?.content || '',
      alt: graphicProject.alt || '',
    };

    return initialValues;
  };

  const update = async ( values, prevValues ) => {
    const { id } = props;

    if ( id ) {
      // ensure we have a project
      await updateGraphicProject( {
        variables: {
          data: buildFormTree( values, prevValues ),
          where: { id },
        },
      } ).catch( err => console.dir( err ) );
    }
  };

  const save = async values => {
    const prevValues = getInitialValues();

    await update( values, prevValues );

    updateNotification( 'Changes saved' );
    startTimeout();
  };

  const onHandleSubmit = async ( values, actions ) => {
    const { setStatus, setErrors, setSubmitting } = actions;

    // 1. let user know system is saving
    updateNotification( 'Saving project...' );

    // 2. Do an initial save.  Upon successful save, system will return a project id
    try {
      const res = await createGraphicProject( {
        variables: {
          data: buildCreateGraphicProjectTree( user, values ),
        },
      } );

      // 3. Use formik handled to update status to hide submit button upon project creation
      //    Button only appears for project creation
      setStatus( 'CREATED' );

      // 4. Start upload of files. (if there are files to upload)
      handleUpload( res.data.createGraphicProject, values.tags );
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
      headline: 'Social Media Graphics Project Data',
      projectTitle: {
        label: 'Project Name',
        required: true,
      },
      visibility: {
        label: 'Visibility Setting',
        required: true,
      },
      team: {
        dropdown: true,
        label: 'Source',
        required: false,
        variables: {
          where: {
            name_in: [
              'GPA Design & Editorial',
              'Regional Media Hubs',
              'ShareAmerica',
              'U.S. Missions',
              'ECA PASC',
              'Bureau of African Affairs (AF)',
            ],
          },
        },
      },
      copyright: {
        label: 'Copyright',
        required: true,
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
      alt: {
        label: 'Alt (Alternative) Text',
        required: false,
      },
    };

    return (
      <ProjectDetailsForm
        { ...formikProps }
        { ...props }
        config={ config }
        save={ save }
      />
    );
  };

  return (
    <div className="content graphic-project-details-form-container" style={ contentStyle }>
      <Formik
        initialValues={ getInitialValues() }
        validationSchema={ props.id ? baseSchema : initialSchema }
        onSubmit={ onHandleSubmit }
      >
        { renderContent }
      </Formik>
    </div>
  );
};

GraphicProjectDetailsFormContainer.propTypes = {
  id: PropTypes.string,
  contentStyle: PropTypes.object,
  data: PropTypes.object,
  updateNotification: PropTypes.func,
  handleUpload: PropTypes.func,
  setIsFormValid: PropTypes.func,
};

export default GraphicProjectDetailsFormContainer;
