import React, {
  useState, Fragment
} from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import * as actions from 'lib/redux/actions/upload';
import { withRouter } from 'next/router';
import { compose } from 'react-apollo';
import { Tab, Dimmer, Loader } from 'semantic-ui-react';
import VideoProjectType from './VideoProjectType/VideoProjectType';
import VideoProjectFiles from './VideoProjectFiles/VideoProjectFiles';
import './VideoUpload.scss';

const VideoUpload = props => {
  console.log( 'rendering VideoUpload' );

  const { updateModalClassname, closeModal, uploadAddFiles } = props;

  const [activeIndex, setActiveIndex] = useState( 0 );
  const [loading, setLoading] = useState( false );


  const goNext = () => {
    setActiveIndex( 1 );
  };


  // @todo complete wiring before activating router
  const gotoVideoEditPage = () => {
    props.router.push( {
      pathname: '/admin/project',
      query: {
        content: 'video',
        action: 'edit'
      }
    } );
  };

  /**
   * Called on submit. Saves applicabe file properties
   * to redux store. Object is then accessed from ProjectDataForm
   * in order to process upload
   * Note: would have preferred using Apollo cache but file object
   * would not serialize properly.
   * @todo Research issue when time permits
   */
  const addFilesToUpload = files => {
    setLoading( true );
    uploadAddFiles( files );
    gotoVideoEditPage();
  };


  /* eslint-disable react/display-name */
  const panes = [
    {
      menuItem: 'Upload Files',
      render: () => (
        <Tab.Pane>
          <VideoProjectType
            closeModal={ closeModal }
            goNext={ goNext }
            updateModalClassname={ updateModalClassname }
          />
        </Tab.Pane>
      )
    },
    {
      menuItem: '',
      render: () => (
        <Tab.Pane>
          <VideoProjectFiles
            closeModal={ closeModal }
            goNext={ goNext }
            updateModalClassname={ updateModalClassname }
            addFilesToUpload={ addFilesToUpload }
          />
        </Tab.Pane>
      )
    }
  ];

  return (
    <Fragment>
      <Dimmer active={ loading } inverted>
        <Loader>Preparing files...</Loader>
      </Dimmer>
      <Tab
        activeIndex={ activeIndex }
        panes={ panes }
        className="videoUpload"
      />
    </Fragment>
  );
};


VideoUpload.propTypes = {
  closeModal: PropTypes.func,
  updateModalClassname: PropTypes.func,
  router: PropTypes.object,
  uploadAddFiles: PropTypes.func, // from redux
};

// @todo - add videoUseByName, imageUseByName queries to server
// as opposed to pulling whole list and filtering needed value
export default compose(
  withRouter,
  connect( null, actions ),
)( VideoUpload );
