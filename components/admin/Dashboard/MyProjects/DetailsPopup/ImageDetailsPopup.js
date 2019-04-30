import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes } from 'lib/utils';

// TO DO: UPDATE QUERY FOR IMAGE PROJECT TYPE
const IMAGE_PROJECT_FILES_QUERY = gql`
  query ImageProjectFilesQuery( $id: ID! ) {
    videoProject( id: $id ) {
      id
      supportFiles(
        where: {
          filetype_not: "srt"
        }
      ) {
        id
        url
        filetype
        filesize
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
  }
`;

const ImageDetailsPopup = props => (
  <Query query={ IMAGE_PROJECT_FILES_QUERY } variables={ { id: props.id } }>
    {
      ( { loading, error, data } ) => {
        if ( loading ) return <p>Loading....</p>;
        if ( error ) return <ApolloError error={ error } />;

        const { supportFiles } = data.videoProject;
        if ( supportFiles.length ) {
          return (
            <div>
              <p>Files:</p>
              { supportFiles.map( file => {
                const {
                  id,
                  url,
                  filetype,
                  filesize,
                  language: { displayName },
                  use
                } = file;
                return (
                  <p key={ id }>
                    { use.name } | <a href={ url }>{ filetype }</a> | <a href={ url }>{ displayName } { formatBytes( filesize ) }</a>
                  </p>
                );
              } ) }
            </div>
          );
        }

        return <p>There are no supporting Image project files.</p>;
      }
    }
  </Query>
);

ImageDetailsPopup.propTypes = {
  id: PropTypes.string
};

export default ImageDetailsPopup;
