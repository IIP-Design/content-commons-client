/**
 *
 * EditVideoModal
 *
 */
import React from 'react';

import FileSection from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import UnitDataForm from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm';
import VideoUnitCarousel from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/VideoUnitCarousel/VideoUnitCarousel';
import { EditSingleProjectItemContext } from 'components/admin/projects/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';

import './EditVideoModal.scss';

const EditVideoModal = () => (
  <EditSingleProjectItemContext.Consumer>
    { ( { selectedProject, selectedUnit, updateUnit } ) => (
      <div className="edit-video-modal">
        <UnitDataForm unitId={ selectedUnit } />
        <FileSection unitId={ selectedUnit } />
        <VideoUnitCarousel
          callback={ updateUnit }
          projectId={ selectedProject }
          unitId={ selectedUnit }
        />
      </div>
    ) }
  </EditSingleProjectItemContext.Consumer>
);

export default EditVideoModal;
