import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import GraphicFilesForm from 'components/admin/ProjectEdit/GraphicEdit/GraphicProjectGraphicFiles/GraphicFilesForm/GraphicFilesForm';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildUpdateGraphicProjectImagesTree } from 'lib/graphql/builders/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';
import { baseSchema } from './validationSchema';

const GraphicProjectGraphicFiles = props => {
  const { files, projectId, updateNotification } = props;
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

  const showNotification = () => updateNotification( 'Changes saved' );
  const hideNotification = () => updateNotification( '' );
  const { startTimeout } = useTimeout( hideNotification, 2000 );

  const getInitialValues = () => {
    let initialValues = {};

    if ( getCount( files ) > 0 ) {
      initialValues = files.reduce( ( acc, file ) => {
        const {
          id, filename, language, social, style, title
        } = file;

        acc[id] = {
          id,
          title: title || filename,
          language: language?.id || '',
          social: social?.id || '',
          style: style?.id || ''
        };

        return acc;
      }, {} );
    }

    return initialValues;
  };

  const save = async ( values, prevValues ) => {
    if ( projectId ) {
      await updateGraphicProject( {
        variables: {
          data: {
            images: {
              update: buildUpdateGraphicProjectImagesTree( values, prevValues )
            }
          },
          where: {
            id: projectId
          }
        }
      } )
        .then( showNotification )
        .then( () => startTimeout() )
        .catch( err => console.dir( err ) );
    }
  };

  return (
    <Formik
      initialValues={ getInitialValues() }
      validationSchema={ baseSchema }
    >
      { formikProps => (
        <GraphicFilesForm
          { ...formikProps }
          { ...props }
          save={ save }
        />
      ) }
    </Formik>
  );
};

GraphicProjectGraphicFiles.propTypes = {
  projectId: PropTypes.string,
  files: PropTypes.array,
  updateNotification: PropTypes.func
};

export default GraphicProjectGraphicFiles;
