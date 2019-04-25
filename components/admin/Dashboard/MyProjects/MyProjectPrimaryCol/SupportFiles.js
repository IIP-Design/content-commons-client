import React from 'react';
import PropTypes from 'prop-types';
import { Query } from 'react-apollo';
import gql from 'graphql-tag';
import ApolloError from 'components/errors/ApolloError';
import { formatBytes } from 'lib/utils';

const VIDEO_PROJECT_SUPPORT_FILES_QUERY = gql`
  query VideoProjectSupportFiles( $id: ID! ) {
    videoProject( id: $id ) {
      id
      supportFiles {
        id
        url
        filetype
        filesize
        language {
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

const SupportFiles = props => (
  <Query query={ VIDEO_PROJECT_SUPPORT_FILES_QUERY } variables={ { id: props.id } }>
    { ( { loading, error, data } ) => {
      if ( loading ) return <p>Loading....</p>;
      if ( error ) return <ApolloError error={ error } />;
      const { supportFiles } = data.videoProject;
      return (
        <div>
          <p>Files:</p>
          {
            supportFiles.map( file => {
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
            } )
          }
        </div>
      );
    } }
  </Query>
);

SupportFiles.propTypes = {
  id: PropTypes.string
};

export default SupportFiles;
