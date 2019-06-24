/**
 *
 * ProjectItem
 *
 */

import React from 'react';
import { bool, func, string } from 'prop-types';

import withModal from 'components/admin/projects/ProjectEdit/withModal/withModal';
// import Placeholder from 'components/Placeholder/Placeholder';

import './ProjectItem.scss';

const ProjectItem = props => {
  const {
    projectId,
    itemId,
    // isAvailable,
    displayItemInModal,
    modalTrigger,
    modalContent
  } = props;

  const Item = modalTrigger;
  const modalProps = {
    triggerProps: {
      projectId,
      itemId,
      displayItemInModal
    },
    contentProps: {
      itemId,
      projectId
    }
  };
  const modalOptions = { closeIcon: true };


  return (
    ( displayItemInModal
        && withModal( modalProps, modalTrigger, modalContent, modalOptions ) ) || (
        <Item
          projectId={ projectId }
          itemId={ itemId }
          displayItemInModal={ displayItemInModal }
        />
    )
  );
};

ProjectItem.propTypes = {
  projectId: string.isRequired,
  itemId: string.isRequired,
  isAvailable: bool,
  displayItemInModal: bool,
  modalTrigger: func,
  modalContent: func
};

export default ProjectItem;
