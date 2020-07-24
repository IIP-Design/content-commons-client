/**
 *
 * FileSidebar
 *
 */
import React, { useContext } from 'react';
import gql from 'graphql-tag';
import { Query } from 'react-apollo';

import { titleCase } from 'lib/utils';
import { EditSingleProjectItemContext } from 'components/admin/ProjectEdit/EditSingleProjectItem/EditSingleProjectItem';
import Loader from 'components/admin/ProjectEdit/EditVideoModal/Loader/Loader';
import Carousel from 'components/admin/ProjectEdit/EditVideoModal/Carousel/Carousel';

import './FileSidebar.scss';

const VIDEO_UNIT_QUERY = gql`
  query VIDEO_UNIT_QUERY( $id: ID! ) {
    videoUnit( id: $id ) {
      id
      thumbnails {
        image {
          id
          signedUrl
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

const FileSidebar = () => {
  const { selectedFile, selectedUnit, setSelectedFile } = useContext( EditSingleProjectItemContext );

  return (
    <Query query={ VIDEO_UNIT_QUERY } variables={ { id: selectedUnit } }>
      { ( { loading, error, data } ) => {
        if ( loading || !data ) return <Loader text="Loading files..." />;
        if ( error ) return <p>{ `Error: ${error.message}` }</p>;

        const thumbnail = data.videoUnit && data.videoUnit.thumbnails ? data.videoUnit.thumbnails[0] : {};
        const image = thumbnail && thumbnail.image && thumbnail.image.signedUrl ? thumbnail.image.signedUrl : '';
        const files = data.videoUnit && data.videoUnit.files ? data.videoUnit.files : [];

        return (
          <div className="edit-video-sidebar">
            <Carousel legend={ false } selectedItem={ selectedFile } vertical>
              { files && (
                files.map( file => {
                  const fileUse = file.use && file.use.name ? file.use.name : '';
                  const captionStatus = file.videoBurnedInStatus === 'SUBTITLED' ? 'On-Screen Text' : 'No On-Screen Text';

                  return (
                    <div
                      className="edit-video-sidebar-item"
                      id={ file.id }
                      key={ file.id }
                      onClick={ () => setSelectedFile( file.id ) }
                      onKeyUp={ () => setSelectedFile( file.id ) }
                      role="button"
                      tabIndex="0"
                    >
                      <img
                        alt=""
                        className={ selectedFile === file.id ? 'edit-video-sidebar-image selected' : 'edit-video-sidebar-image' }
                        src={ image }
                      />
                      <p>{ `${titleCase( file.quality )} | ${captionStatus}` }</p>
                      <p>{ titleCase( fileUse ) }</p>
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
};

export default FileSidebar;
