import React from 'react';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Query } from 'react-apollo';

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
        use {
          name
        }
      }
    }
  } 
`;

const FileSidebar = ( { callback, id, selected } ) => (
  <Query query={ VIDEO_UNIT_QUERY } variables={ { id } }>
    { ( { loading, error, data } ) => {
      if ( loading ) return <p>Loading...</p>;
      if ( error ) return <p>{ `Error: ${error.message}` }</p>;

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
                <img
                  alt=""
                  className={ selected === file.id ? 'edit-video-sidebar-image selected' : 'edit-video-sidebar-image' }
                  src={ image }
                />
                <p>{ `${file.quality} | ${file.use.name}` }</p>
                <p>{ file.videoBurnedInStatus }</p>
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
  id: propTypes.string,
  selected: propTypes.string
};

export default FileSidebar;
