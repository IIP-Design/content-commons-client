import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Tab
} from 'semantic-ui-react';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import './VideoUpload.scss';

class VideoUpload extends Component {
  state = {
    activeIndex: 0,
  }

  panes = [
    {
      menuItem: 'What type of video project is this?',
      render: () => <Tab.Pane><VideoProjectType closeModal={ this.props.closeModal } goNext={ this.goNext } /></Tab.Pane>
    },
    { menuItem: 'Tab 2', render: () => <Tab.Pane>Tab 2 Content</Tab.Pane> },
    { menuItem: 'Tab 3', render: () => <Tab.Pane>Tab 3 Content</Tab.Pane> },
  ];

  goNext = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex + 1 } ) );
  }

  goBack = () => {
    this.setState( prevState => ( { activeIndex: prevState.activeIndex - 1 } ) );
  }

  handleTabChange = ( e, { activeIndex } ) => this.setState( { activeIndex } );

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
