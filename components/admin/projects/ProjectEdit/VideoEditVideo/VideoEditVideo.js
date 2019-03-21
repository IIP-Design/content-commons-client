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
import VideoBasicDataForm from 'components/admin/projects/ProjectEdit/VideoBasicDataForm/VideoBasicDataForm';
import VideoLinkDataForm from 'components/admin/projects/ProjectEdit/VideoLinkDataForm/VideoLinkDataForm';

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
    }
  } 
`;

class VideoEditVideo extends React.PureComponent {
  render() {
    const { id } = this.props;

    const panes = [
      { menuItem: 'Basic', render: () => <Tab.Pane attached={ false }><VideoBasicDataForm id={ id } /></Tab.Pane> },
      { menuItem: 'Links', render: () => <Tab.Pane attached={ false }><VideoLinkDataForm id={ id } /></Tab.Pane> }
    ];

    return (
      <Query query={ CURRENT_VIDEO_UNIT } variables={ { id } }>
        { ( { loading, error, data } ) => {
          console.log( data );
          if ( loading ) return <p>Loading...</p>;
          if ( error ) return <p>Error</p>;
          const { image } = data.videoUnit.thumbnails[0];
          return (
            <div className="edit-video-modal">
              <figure className="modal_thumbnail overlay">
                <img className="overlay-image" src={ image.url } alt={ image.alt } />
                <div className="overlay-hover">
                  <div className="overlay-text">Change Thumbnail</div>
                </div>
              </figure>
              <section className="modal_section modal_section--metaContent">
                <div className="modal_meta_wrapper">
                  <div className="modal_meta">
                    <span className="modal_meta_content modal_meta_content--filename">
                      { /* { data.fileName } */ }
                    </span>
                    <br />
                    <span className="modal_meta_content modal_meta_content--filesize">
                      { 'Filesize: ' }
                    </span>
                    <span className="modal_meta_content modal_meta_content--dimensions">
                      { 'Dimensions: ' }
                    </span>
                    <span className="modal_meta_content modal_meta_content--date">
                      { /* { `Uploaded: ${moment( data.uploaded ).format( 'MMMM DD, YYYY [at] h:mm A' )}` } */ }
                    </span>
                    <span className="modal_meta_content modal_meta_content--duration">
                      { 'Duration: ' }
                    </span>
                  </div>
                </div>
              </section>
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
