import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes, getCount, getS3Url } from 'lib/utils';

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
  files.filter( file => file )
);

const getVideoFiles = units => (
  units.reduce( ( acc, unit ) => {
    if ( !unit.files ) return;
    const validFiles = getValidFiles( unit.files );

    return [...acc, ...validFiles];
  }, [] )
);

const VideoDetailsPopup = props => (
  <Query query={ VIDEO_PROJECT_FILES_QUERY } variables={ { id: props.id } }>
    {
      ( { loading, error, data } ) => {
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
                      <a href={ getS3Url( vidFile.url ) }>{ vidFile.quality }</a>
                      { ' | ' }
                      <a href={ getS3Url( vidFile.url ) }>
                        { vidFile.language && vidFile.language.displayName }
                        { ' ' }
                        (
                        { formatBytes( vidFile.filesize ) }
                        )
                      </a>
                    </li>
                  );
                } ) }
                { supportFiles && supportFiles.map( sprtFile => {
                  if ( !sprtFile || getCount( sprtFile ) === 0 ) return null;

                  return (
                    <li key={ sprtFile.id }>
                      { 'SRT | ' }
                      <a href={ getS3Url( sprtFile.url ) }>{ sprtFile.language && sprtFile.language.displayName }</a>
                      { ' | ' }
                      <a href={ getS3Url( sprtFile.url ) }>{ formatBytes( sprtFile.filesize ) }</a>
                    </li>
                  );
                } ) }
              </ul>
            </div>
          );
        }

        return <p>There are no supporting video files.</p>;
      }
    }
  </Query>
);

VideoDetailsPopup.propTypes = {
  id: PropTypes.string,
};

export default VideoDetailsPopup;

export { getValidFiles, getVideoFiles, VIDEO_PROJECT_FILES_QUERY };
