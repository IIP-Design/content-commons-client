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

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      id
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
      <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
        { ( { loading, error, data } ) => {
          if ( loading || !data ) return <p>Loading...</p>;
          if ( error ) return <p>{ `Error: ${error.message}` }</p>;

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
