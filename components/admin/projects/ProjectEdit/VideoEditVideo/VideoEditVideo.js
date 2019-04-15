/**
 *
 * VideoEditVideo
 *
 */
import React from 'react';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Query } from 'react-apollo';

import UnitDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/UnitDataForm';
import FileSection from 'components/admin/projects/ProjectEdit/VideoEditVideo/FileSection';

import './VideoEditVideo.scss';

const CURRENT_VIDEO_UNIT = gql`
  query CURRENT_VIDEO_UNIT( $id: ID! ) {
    videoUnit( id: $id ) {
      files {
        id
      }
    }
  } 
`;

class VideoEditVideo extends React.PureComponent {
  render() {
    const { id } = this.props;

    return (
      <Query query={ CURRENT_VIDEO_UNIT } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;

          const initialFile = data.videoUnit.files[0].id;

          return (
            <div className="edit-video-modal">
              <UnitDataForm id={ id } />
              <FileSection unitId={ id } fileId={ initialFile } />
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
  id: propTypes.string
};

export default VideoEditVideo;
