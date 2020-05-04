import React from 'react';
import PropTypes from 'prop-types';
import { useMutation } from '@apollo/react-hooks';
import { Formik } from 'formik';
import AddFilesSectionHeading from 'components/admin/ProjectEdit/GraphicEdit/AddFilesSectionHeading/AddFilesSectionHeading';
import GraphicFilesForm from 'components/admin/ProjectEdit/GraphicEdit/GraphicFilesFormContainer/GraphicFilesForm/GraphicFilesForm';
import { UPDATE_GRAPHIC_PROJECT_MUTATION } from 'lib/graphql/queries/graphic';
import { buildUpdateGraphicProjectImagesTree } from 'lib/graphql/builders/graphic';
import useTimeout from 'lib/hooks/useTimeout';
import { getCount } from 'lib/utils';
import { baseSchema } from './validationSchema';
import './GraphicFilesFormContainer.scss';

const GraphicFilesFormContainer = props => {
  const {
    files,
    projectId,
    handleAddFiles,
    setIsFormValid,
    updateNotification
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
    <div className="graphic-files-form-container">
      <AddFilesSectionHeading
        projectId={ projectId }
        title="Graphics in Project"
        acceptedFileTypes="image/gif, image/jpeg, image/png"
        handleAddFiles={ handleAddFiles }
      />

      <Formik
        initialValues={ getInitialValues() }
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
    </div>
  );
};

GraphicFilesFormContainer.propTypes = {
  projectId: PropTypes.string,
  files: PropTypes.array,
  handleAddFiles: PropTypes.func,
  setIsFormValid: PropTypes.func,
  updateNotification: PropTypes.func
};

export default GraphicFilesFormContainer;
