/**
 *
 * EditVideoModal
 *
 */
import React, { Component } from 'react';
import propTypes from 'prop-types';

import FileSection from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/FileSection/FileSection';
import UnitDataForm from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalForms/UnitDataForm';
import VideoUnitCarousel from 'components/admin/projects/ProjectEdit/EditVideoModal/ModalSections/VideoUnitCarousel/VideoUnitCarousel';

import './EditVideoModal.scss';

class EditVideoModal extends Component {
  state = {}

  componentDidMount() {
    const { unitId } = this.props;

    this.setState( {
      selected: unitId
    } );
  }

  handleUnitChoice = selected => {
    this.setState( {
      selected
    } );
  }

  render() {
    const { projectId } = this.props;
    const { selected } = this.state;

    return (
      <div className="edit-video-modal">
        <UnitDataForm unitId={ selected } />
        <FileSection unitId={ selected } />
        <VideoUnitCarousel
          callback={ this.handleUnitChoice }
          projectId={ projectId }
          unitId={ selected }
        />
      </div>
    );
  }
}

EditVideoModal.propTypes = {
  projectId: propTypes.string,
  unitId: propTypes.string
};

export default EditVideoModal;
