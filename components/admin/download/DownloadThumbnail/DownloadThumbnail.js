import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';

const DownloadThumbnail = props => {
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
          content="Loading thumbnail(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { thumbnails } = project;

  const renderFormItem = thumbnail => {
    const { id, url, language: { displayName } } = thumbnail;

    return (
      <DownloadItemContent
        key={ `fs_${id}` }
        srcUrl={ getS3Url( url ) }
        hoverText={ `Download ${displayName} Thumbnail` }
        isAdminPreview={ isPreview }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download ${displayName} Thumbnail` }
            </strong>
          </p>
        </div>
      </DownloadItemContent>
    );
  };

  const renderFormItems = () => {
    const t = thumbnails
      .filter( thumbnail => thumbnail && thumbnail.url )
      .map( thumbnail => renderFormItem( thumbnail ) );

    return t.length ? t : 'There are no thumbnails available for download at this time';
  };

  return thumbnails && renderFormItems( thumbnails );
};

DownloadThumbnail.propTypes = {
  data: PropTypes.object,
  instructions: PropTypes.string,
  isPreview: PropTypes.bool,
};

const VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY = gql`
  query VideoProjectPreviewThumbnails($id: ID!) {
    project: videoProject(id: $id) {
      id
      thumbnails(
        where: {
          OR: [
            { filetype: "image/jpeg" },
            { filetype: "image/png" },
            { filename_ends_with: "jpg" },
            { filename_ends_with: "png" }
          ],
          AND: {
            use: { name: "Thumbnail/Cover Image" }
          }
        },
        orderBy: filename_ASC
      ) {
        id
        url
        language {
          id
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id,
    },
  } ),
} )( DownloadThumbnail );

export { VIDEO_PROJECT_PREVIEW_THUMBNAILS_QUERY };
