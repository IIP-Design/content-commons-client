/**
 *
 * VideoEditVideo
 *
 */
import React from 'react';
// import moment from 'moment';
import gql from 'graphql-tag';
import { string } from 'prop-types';

import { Query } from 'react-apollo';
import { Tab } from 'semantic-ui-react';
import BasicForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/BasicForm';
import LinkForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/LinkForm';
import ProjectDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/ProjectDataForm';

import './VideoEditVideo.scss';

const CURRENT_VIDEO_UNIT = gql`
  query CURRENT_VIDEO_UNIT( $id: ID! ) {
    videoUnit( id: $id ) {
      thumbnails {
        image {
          alt
          url
        }
      }
      files {
        duration
        filename
        filesize
        dimensions {
          width
          height
        }
      }
    }
  } 
`;

class VideoEditVideo extends React.PureComponent {
  render() {
    const { id } = this.props;

    const panes = [
      { menuItem: 'Basic', render: () => <Tab.Pane attached={ false }><BasicForm id={ id } /></Tab.Pane> },
      { menuItem: 'Links', render: () => <Tab.Pane attached={ false }><LinkForm id={ id } /></Tab.Pane> }
    ];

    return (
      <Query query={ CURRENT_VIDEO_UNIT } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;

          const { videoUnit } = data;
          const file = videoUnit.files[0];

          return (
            <div className="edit-video-modal">
              <ProjectDataForm id={ id } />
              <section className="tabbed-container">
                <Tab menu={ { secondary: true, pointing: true } } panes={ panes } />
              </section>
              <section className="video-carousel">
                <h3 className="video-carousel-header">Videos in this Project</h3>
              </section>
            </div>
          );
        } }
      </Query>
    );
  }
}

VideoEditVideo.propTypes = {
  id: string
};

export default VideoEditVideo;
