import React from 'react';
import PropTypes from 'prop-types';
import { gql, useQuery } from '@apollo/client';

import ApolloError from 'components/errors/ApolloError';
import { formatBytes, getCount } from 'lib/utils';

const VIDEO_PROJECT_FILES_QUERY = gql`
  query VideoProjectFiles( $id: ID! ) {
    videoProject( id: $id ) {
      id
      projectType
      units {
        id        
        files {
          id
          filesize
          quality
          url
          language {
            id
            displayName
          }
          use {
            id
            name
          }
        }
      }
      supportFiles(
        where: {
          filetype: "srt"
        }
      ) {
        id
        url
        filesize
        language {
          id
          displayName
        }        
      }
    }
  }
`;

const getValidFiles = files => (
  files.filter( file => file && getCount( file ) > 0 )
);

const getVideoFiles = units => (
  units.reduce( ( acc, unit ) => {
    if ( !unit.files ) return;
    const validFiles = getValidFiles( unit.files );

    return [...acc, ...validFiles];
  }, [] )
);

const VideoDetailsPopup = ( { id } ) => {
  const { loading, error, data } = useQuery( VIDEO_PROJECT_FILES_QUERY, {
    variables: { id },
  } );

  if ( loading ) return <p>Loading....</p>;
  if ( error ) return <ApolloError error={ error } />;
  if ( !data.videoProject ) return null;

  const {
    units,
    supportFiles,
  } = data.videoProject;

  const videoFiles = getVideoFiles( units );

  if ( getCount( videoFiles ) || getCount( supportFiles ) ) {
    return (
      <div className="details-files">
        <ul>
          { videoFiles && videoFiles.map( vidFile => {
            if ( !vidFile || getCount( vidFile ) === 0 ) return null;

            return (
              <li key={ vidFile.id }>
                { vidFile.use && vidFile.use.name }
                { ' | ' }
                { vidFile.quality }
                { ' | ' }
                { vidFile.language && vidFile.language.displayName }
                { ' ' }
                (
                { formatBytes( vidFile.filesize ) }
                )
              </li>
            );
          } ) }
          { supportFiles && supportFiles.map( sprtFile => {
            if ( !sprtFile || getCount( sprtFile ) === 0 ) return null;

            return (
              <li key={ sprtFile.id }>
                { 'SRT | ' }
                { sprtFile.language && sprtFile.language.displayName }
                { ' | ' }
                { formatBytes( sprtFile.filesize ) }
              </li>
            );
          } ) }
        </ul>
      </div>
    );
  }

  return <p>There are no supporting video files.</p>;
};

VideoDetailsPopup.propTypes = {
  id: PropTypes.string,
};

export default VideoDetailsPopup;

export { getValidFiles, getVideoFiles, VIDEO_PROJECT_FILES_QUERY };
