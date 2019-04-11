import React from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';
import propTypes from 'prop-types';

import './FileSidebar.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      thumbnails {
        image {
          url
        }
      }
      files {
        id
        quality
        videoBurnedInStatus
      }
    }
  } 
`;

const FileSidebar = ( { callback, id } ) => (
  <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
    { ( { loading, error, data } ) => {
      if ( loading ) return <p>Loading...</p>;
      if ( error ) return <p>Error</p>;

      console.log( data );
      const thumbnail = data.videoUnit.thumbnails[0];
      const image = thumbnail.image.url;
      const { files } = data.videoUnit;

      return (
        <div className="edit-video-sidebar">
          { files && (
            files.map( file => (
              <div
                className="edit-video-sidebar-item"
                key={ file.id }
                onClick={ () => callback( file.id ) }
                onKeyUp={ () => callback( file.id ) }
                role="button"
                tabIndex="0"
              >
                <img className="edit-video-sidebar-image" src={ image } alt="" />
                <p>{ `${file.quality}, ${file.videoBurnedInStatus}` }</p>
              </div>
            ) )
          ) }
        </div>
      );
    } }
  </Query>
);

FileSidebar.propTypes = {
  callback: propTypes.func,
  id: propTypes.string
};

export default FileSidebar;
