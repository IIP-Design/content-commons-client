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
    videoAssets: null,
    fileNames: []
  }

  panes = [
    {
      menuItem: 'Upload Files',
      render: () => (
        <Tab.Pane>
          <VideoProjectType
            closeModal={ this.props.closeModal }
            goNext={ this.goNext }
            updateModalClassname={ this.props.updateModalClassname }
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
            updateModalClassname={ this.props.updateModalClassname }
            files={ this.state.fileNames }
            handleVideoAssetsUpload={ this.handleVideoAssetsUpload }
            removeVideoAssetFile={ this.removeVideoAssetFile }
            replaceVideoAssetFile={ this.replaceVideoAssetFile }
          />
        </Tab.Pane>
      )
    }
  ];

  goNext = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex + 1 } ) );
  }

  goBack = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex - 1 } ) );
  }

  handleVideoAssetsUpload = e => {
    const fileList = Array.from( e.target.files );

    this.setState( prevState => ( {
      videoAssets: prevState.videoAssets !== null ? [...prevState.videoAssets, ...fileList] : [...fileList],
      fileNames: prevState.fileNames.length > 0
        ? [...prevState.fileNames, ...fileList.map( file => file.name )]
        : fileList.map( file => file.name )
    } ) );
  }

  removeVideoAssetFile = fileName => {
    this.setState( prevState => ( {
      videoAssets: prevState.videoAssets.filter( file => file.name !== fileName ),
      fileNames: prevState.videoAssets.filter( file => file.name !== fileName ).map( file => file.name )
    } ) );
  }

  replaceVideoAssetFile = e => {
    e.persist();
    const { files, dataset: { filename } } = e.target;

    this.setState( prevState => {
      const { videoAssets } = prevState;

      // Find index of file in videoAssets
      const assetIndex = videoAssets.map( file => file.name ).indexOf( filename );

      // Set index to new uploaded file
      const uploadedFile = files[0];
      videoAssets[assetIndex] = uploadedFile;

      // Reset value attached to input
      // so browser doesn't think selecting same file again if need to upload file w/ same name
      e.target.value = '';

      // Update state with new videoAssets array
      return {
        videoAssets,
        fileNames: videoAssets.map( file => file.name )
      };
    } );
  }

  render() {
    const { activeIndex } = this.state;
    return (
      <Tab
        activeIndex={ activeIndex }
        panes={ this.panes }
        className="videoUpload"
      />
    );
  }
}

VideoUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func
};

export default VideoUpload;
