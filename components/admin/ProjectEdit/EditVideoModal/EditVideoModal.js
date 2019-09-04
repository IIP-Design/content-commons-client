/**
 *
 * EditVideoModal
 *
 */
import React, { useContext } from 'react';

import FileSection from 'components/admin/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import UnitDataForm from 'components/admin/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm/UnitDataForm';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import './EditVideoModal.scss';

const EditVideoModal = () => {
  const {
    language, selectedFile, selectedProject, selectedUnit
  } = useContext(
    EditSingleProjectItemContext
  );

  return (
    <div className="edit-video-modal">
      <UnitDataForm
        language={ language }
        fileId={ selectedFile }
        projectId={ selectedProject }
        unitId={ selectedUnit }
      />
      <FileSection />
    </div>
  );
};

export default EditVideoModal;