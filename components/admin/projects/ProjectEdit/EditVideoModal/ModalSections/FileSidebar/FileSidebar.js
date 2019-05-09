import React from 'react';
import gql from 'graphql-tag';
import propTypes from 'prop-types';
import { Query } from 'react-apollo';

import { titleCase } from 'lib/utils';
import Carousel from 'components/admin/projects/ProjectEdit/EditVideoModal/Carousel/Carousel';

import './FileSidebar.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      id
      thumbnails {
        image {
          id
          url
        }
      }
      files {
        id
        quality
        videoBurnedInStatus
        use {
          id
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
          <Carousel callback={ callback } legend={ false } selectedItem={ selected } vertical>
            { files && (
              files.map( file => {
                const fileUse = file.use && file.use.name ? `| ${file.use.name}` : '';
                return (
                  <div
                    className="edit-video-sidebar-item"
                    id={ file.id }
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
                    <p>{ `${titleCase( file.quality )} ${fileUse}` }</p>
                    <p>{ titleCase( file.videoBurnedInStatus ) }</p>
                  </div>
                );
              } )
            ) }
          </Carousel>
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
