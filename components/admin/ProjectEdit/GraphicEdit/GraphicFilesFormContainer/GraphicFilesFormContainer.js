import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/client';
import { Formik } from 'formik';
import GraphicFilesForm from 'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesForm/GraphicFilesForm';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildUpdateGraphicProjectImagesTree } from 'lib/graphql/builders/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';
import { baseSchema } from './validationSchema';

const GraphicFilesFormContainer = props => {
  const {
    files,
    projectId,
    setIsFormValid,
    updateNotification,
  } = props;
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const showNotification = () => updateNotification( 'Changes saved' );
  const hideNotification = () => updateNotification( '' );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const getInitialValues = () => {
    let initialValues = {};

    if ( getCount( files ) > 0 ) {
      initialValues = files.reduce( ( acc, file ) => {
        const {
          id, filename, language, social, style, title,
        } = file;

        const socialPlatforms = social
          ? social.map( platform => platform.id )
          : [];

        acc[id] = {
          id,
          title: title || filename,
          language: language?.id || '',
          social: socialPlatforms,
          style: style?.id || '',
        };

        return acc;
      }, {} );
    }

    return initialValues;
  };

  const save = async values => {
    /**
     * Send transformed files instead of formik prevValues
     * as the second param for the build fn to
     * address a bug where prevValues are equal to
     * values on the *first* call of this save fn.
     */
    const prevValues = getInitialValues();

    if ( projectId ) {
      await updateGraphicProject( {
        variables: {
          data: {
            images: {
              update: buildUpdateGraphicProjectImagesTree( values, prevValues ),
            },
          },
          where: {
            id: projectId,
          },
        },
      } )
        .then( showNotification )
        .then( () => startTimeout() )
        .catch( err => console.dir( err ) );
    }
  };

  return (
    <Formik
      initialValues={ getInitialValues() }
      enableReinitialize
      validationSchema={ baseSchema }
    >
      { formikProps => {
        setIsFormValid( formikProps.isValid );

        return (
          <GraphicFilesForm
            { ...formikProps }
            { ...props }
            save={ save }
          />
        );
      } }
    </Formik>
  );
};

GraphicFilesFormContainer.propTypes = {
  projectId: PropTypes.string,
  files: PropTypes.array,
  setIsFormValid: PropTypes.func,
  updateNotification: PropTypes.func,
};

export default GraphicFilesFormContainer;
