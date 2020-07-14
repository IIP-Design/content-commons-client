import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';


const DownloadOtherFiles = props => {
  const { data, isPreview } = props;
  const { error, loading, project } = data;

  if ( loading ) {
    return (
      <div
        style={ {
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '200px',
        } }
      >
        <Loader
          active
          inline="centered"
          style={ { marginBottom: '1em' } }
          content="Loading other file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { files } = project;

  const renderFormItem = file => {
    const {
      id, filetype, url,
      language: { displayName },
    } = file;

    return (
      <DownloadItemContent
        key={ `fs_${id}` }
        srcUrl={ getS3Url( url ) }
        hoverText={ `Download ${displayName} ${filetype} file` }
        isAdminPreview={ isPreview }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download ${displayName} ${filetype} file` }
            </strong>
          </p>
        </div>
      </DownloadItemContent>
    );
  };

  const renderFormItems = () => {
    const otherFiles = files
      .filter( file => file && file.url )
      .map( file => renderFormItem( file ) );

    return otherFiles.length ? otherFiles : 'There are no other files available for download at this time';
  };

  return files && renderFormItems( files );
};

DownloadOtherFiles.propTypes = {
  data: PropTypes.object,
  isPreview: PropTypes.bool,
};

const VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY = gql`
  query VideoProjectPreviewOtherfiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      files: supportFiles(
        where: {
          AND: [
            { filetype_not: "application/x-subrip" },
            { filename_not_ends_with: "vtt" }
          ]
        },
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        url
        language {
          id
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id,
    },
  } ),
} )( DownloadOtherFiles );

export { VIDEO_PROJECT_PREVIEW_OTHER_FILES_QUERY };
