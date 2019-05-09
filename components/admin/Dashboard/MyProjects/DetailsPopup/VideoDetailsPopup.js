import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes } from 'lib/utils';

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
            displayName
          }
          use {
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

const VideoDetailsPopup = props => (
  <Query query={ VIDEO_PROJECT_FILES_QUERY } variables={ { id: props.id } }>
    {
      ( { loading, error, data } ) => {
        if ( loading ) return <p>Loading....</p>;
        if ( error ) return <ApolloError error={ error } />;

        const {
          units,
          supportFiles
        } = data.videoProject;

        const videoFiles = units.map( unit => unit.files.reduce( ( acc, file ) => file, {} ) );
        if ( videoFiles.length || supportFiles.length ) {
          return (
            <div>
              <p>Files:</p>
              <ul>
                { videoFiles && videoFiles.map( vidFile => (
                  <li key={ vidFile.id }>
                    { vidFile.use.name } | <a href={ vidFile.url }>{ vidFile.quality }</a> | <a href={ vidFile.url }>{ vidFile.language.displayName } ({ formatBytes( vidFile.filesize ) })</a>
                  </li>
                ) ) }
                { supportFiles && supportFiles.map( sprtFile => (
                  <li key={ sprtFile.id }>SRT | <a href={ sprtFile.url }>{ sprtFile.language.displayName }</a> | <a href={ sprtFile.url }>{ formatBytes( sprtFile.filesize ) }</a></li>
                ) ) }
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
  id: PropTypes.string
};

export default VideoDetailsPopup;
