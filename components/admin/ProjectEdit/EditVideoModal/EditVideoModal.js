/**
 *
 * EditVideoModal
 *
 */
import React, { useContext } from 'react';
import propTypes from 'prop-types';
import { compose, graphql } from 'react-apollo';

import FileSection from 'components/admin/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import Loader from 'components/admin/ProjectEdit/EditVideoModal/Loader/Loader';
import Notification from 'components/Notification/Notification';
import UnitDataForm from 'components/admin/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm/UnitDataForm';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import { VIDEO_UNIT_QUERY } from 'components/admin/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm/UnitDataFormQueries';

import './EditVideoModal.scss';
import { Formik } from 'formik';

const EditVideoModal = ( { data } ) => {
  const {
    language, selectedFile, selectedProject, selectedUnit, showNotication
  } = useContext(
    EditSingleProjectItemContext
  );

  const getInitialValues = () => {
    const videoUnit = data && data.unit ? data.unit : {};
    const tags = videoUnit.tags ? videoUnit.tags.map( tag => tag.id ) : [];

    const initialValues = {
      descPublic: videoUnit.descPublic || '',
      tags,
      title: videoUnit.title || ''
    };

    return initialValues;
  };

  const unitSection = !data.unit || data.loading
    ? <Loader height="340px" text="Loading the video data..." />
    : (
      <Formik
        initialValues={ getInitialValues() }
        render={ formikProps => (
          <UnitDataForm
            language={ language }
            fileId={ selectedFile }
            projectId={ selectedProject }
            unitId={ selectedUnit }
            unit={ data.unit }
            { ...formikProps }
          />
        ) }
      />
    );

  return (
    <div className="edit-video-modal">
      <Notification
        customStyles={ {
          position: 'absolute',
          top: '2em',
          left: '50%',
          transform: 'translateX(-50%)'
        } }
        el="p"
        icon
        msg="Saving changes"
        show={ showNotication }
      />
      { unitSection }
      <FileSection />
    </div>
  );
};

EditVideoModal.propTypes = {
  data: propTypes.object
};

export default compose(
  graphql( VIDEO_UNIT_QUERY, {
    partialRefetch: true,
    skip: props => !props.unitId
  } ),
)( EditVideoModal );
