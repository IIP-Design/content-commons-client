import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import GraphicFilesForm from 'components/admin/ProjectEdit/GraphicEdit/GraphicProjectGraphicFiles/GraphicFilesForm/GraphicFilesForm';
import { getCount } from 'lib/utils';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildUpdateGraphicProjectImagesTree } from 'lib/graphql/builders/graphic';
import { baseSchema } from './validationSchema';

const GraphicProjectGraphicFiles = props => {
  const { files, projectId } = props;
  const [updateGraphicProject] = useMutation( UPDATE_GRAPHIC_PROJECT_MUTATION );

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
      } ).catch( err => console.dir( err ) );
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
  files: PropTypes.array
};

export default GraphicProjectGraphicFiles;
