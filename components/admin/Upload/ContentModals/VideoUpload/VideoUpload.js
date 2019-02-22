import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Tab
} from 'semantic-ui-react';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import VideoProjectFiles from './VideoProjectFiles/VideoProjectFiles';
import './VideoUpload.scss';

class VideoUpload extends Component {
  state = {
    activeIndex: 0,
    videoAssets: null
  }

  panes = [
    {
      menuItem: 'What type of video project is this?',
      render: () => (
        <Tab.Pane>
          <VideoProjectType
            closeModal={ this.props.closeModal }
            goNext={ this.goNext }
            handleVideoAssetsUpload={ this.handleVideoAssetsUpload }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: '',
      render: () => (
        <Tab.Pane>
          <VideoProjectFiles
            closeModal={ this.props.closeModal }
            goNext={ this.goNext }
            files={ this.state.videoAssets }
          />
        </Tab.Pane>
      )
    },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];

  goNext = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex + 1 } ) );
  }

  goBack = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex - 1 } ) );
  }

  handleTabChange = ( e, { activeIndex } ) => this.setState( { activeIndex } );

  handleVideoAssetsUpload = e => {
    this.setState( { videoAssets: e.target.files } );
    this.goNext();
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Tab
        activeIndex={ activeIndex }
        panes={ this.panes }
        onTabChange={ this.handleTabChange }
        className="videoUpload"
      />
    );
  }
}

VideoUpload.propTypes = {
  closeModal: PropTypes.func,
};

export default VideoUpload;
