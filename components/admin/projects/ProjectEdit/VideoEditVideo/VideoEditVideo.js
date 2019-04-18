/**
 *
 * VideoEditVideo
 *
 */
import React, { Component } from 'react';
import propTypes from 'prop-types';

import FileSection from 'components/admin/projects/ProjectEdit/VideoEditVideo/FileSection';
import UnitDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/UnitDataForm';
import VideoUnitCarousel from 'components/admin/projects/ProjectEdit/VideoEditVideo/VideoUnitCarousel';

import './VideoEditVideo.scss';

class VideoEditVideo extends Component {
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

VideoEditVideo.propTypes = {
  projectId: propTypes.string,
  unitId: propTypes.string
};

export default VideoEditVideo;
