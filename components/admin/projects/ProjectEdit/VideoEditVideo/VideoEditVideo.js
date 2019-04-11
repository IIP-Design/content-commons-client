/**
 *
 * VideoEditVideo
 *
 */
import React from 'react';
// import moment from 'moment';
import gql from 'graphql-tag';
import propTypes from 'prop-types';

import { Query } from 'react-apollo';
import UnitDataForm from 'components/admin/projects/ProjectEdit/VideoEditVideo/EditVideoForms/UnitDataForm';
import FileSection from 'components/admin/projects/ProjectEdit/VideoEditVideo/FileSection';

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
        id
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

    return (
      <Query query={ CURRENT_VIDEO_UNIT } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;

          // const { videoUnit } = data;
          // const firstFile = data.videoUnit.files[0];
          // console.log( firstFile );

          return (
            <div className="edit-video-modal">
              <UnitDataForm id={ id } />
              <FileSection id={ id } />
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
