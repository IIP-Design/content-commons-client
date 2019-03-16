/**
 *
 * ProjectItem
 *
 */

import React from 'react';
import {
  bool, func, object, string
} from 'prop-types';

import withModal from 'components/admin/projects/ProjectEdit/withModal/withModal';
import Placeholder from 'components/admin/projects/shared/Placeholder/Placeholder';

import './ProjectItem.scss';

const ProjectItem = props => {
  const {
    projectId,
    itemId,
    isAvailable,
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
    }
  };
  const sharedStyles = { cursor: 'not-allowed' };
  const modalOptions = { closeIcon: true };

  if ( isAvailable ) {
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
  }

  return (
    <Placeholder
      parentEl="li"
      childEl="div"
      parentStyles={ {
        position: 'relative',
        height: '0',
        paddingTop: '56.25%',
        marginBottom: '1.5em'
      } }
      childStyles={ {
        thumbnail: {
          ...sharedStyles,
          position: 'absolute',
          top: '0',
          left: '0',
          height: '100%',
          width: '100%'
        },
        heading: {
          ...sharedStyles,
          height: '1.3em',
          width: '80%',
          marginTop: '0.625em'
        },
        language: {
          ...sharedStyles,
          width: '60%'
        }
      } }
    />
  );
};

ProjectItem.propTypes = {
  projectId: string.isRequired,
  itemId: string.isRequired,
  isAvailable: bool,
  displayItemInModal: bool,
  modalTrigger: func,
  modalContent: func,
  customPlaceholderStyle: object
};

export default ProjectItem;
