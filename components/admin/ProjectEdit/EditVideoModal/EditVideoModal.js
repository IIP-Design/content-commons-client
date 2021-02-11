/**
 *
 * EditVideoModal
 *
 */
import React, { useContext } from 'react';

import FileSection from 'components/admin/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import Notification from 'components/Notification/Notification';
import UnitDataForm from 'components/admin/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm/UnitDataForm';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import './EditVideoModal.scss';

const EditVideoModal = () => {
  const {
    language, selectedFile, selectedProject, selectedUnit, showNotication,
  } = useContext(
    EditSingleProjectItemContext,
  );

  return (
    <div className="edit-video-modal">
      <Notification
        customStyles={ {
          position: 'absolute',
          top: '2em',
          left: '50%',
          transform: 'translateX(-50%)',
        } }
        el="p"
        icon
        msg="Saving changes"
        show={ showNotication }
      />
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
