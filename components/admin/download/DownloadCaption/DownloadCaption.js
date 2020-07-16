import React from 'react';
import PropTypes from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import { Loader } from 'semantic-ui-react';
import DownloadItemContent from 'components/download/DownloadItem/DownloadItemContent';
import { getS3Url } from 'lib/utils';
import ApolloError from 'components/errors/ApolloError';

const DownloadCaption = props => {
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
          content="Loading Caption file(s)..."
        />
      </div>
    );
  }

  if ( error ) return <ApolloError error={ error } />;
  if ( !project || !Object.keys( project ).length ) return null;

  const { files } = project;

  const renderFormItem = unit => {
    const { id, url, language: { displayName } } = unit;
    const isVtt = url.includes( '.vtt' );

    return (
      <DownloadItemContent
        key={ `fs_${id}` }
        srcUrl={ getS3Url( url ) }
        hoverText={ `Download ${displayName} ${isVtt ? 'VTT' : 'SRT'}` }
        isAdminPreview={ isPreview }
      >
        <div className="item-content">
          <p className="item-content__title">
            <strong>
              { `Download ${displayName} ${isVtt ? 'VTT' : 'SRT'}` }
            </strong>
          </p>
        </div>
      </DownloadItemContent>
    );
  };

  const renderFormItems = () => {
    const captions = files
      .filter( unit => unit && unit.url )
      .map( unit => renderFormItem( unit ) );

    return captions.length ? captions : 'There are no caption files available for download at this time';
  };

  return files && renderFormItems( files );
};

DownloadCaption.propTypes = {
  data: PropTypes.object,
  isPreview: PropTypes.bool,
};

const VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY = gql`
  query VideoProjectPreviewCaptions($id: ID!) {
    project: videoProject(id: $id) {
      id
      files: supportFiles(
        where: {
          OR:[
            { filetype: "application/x-subrip" },
            { filename_ends_with: "srt" },
            { filename_ends_with: "vtt" },
          ]
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

export default graphql( VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY, {
  options: props => ( {
    variables: {
      id: props.id,
    },
  } ),
} )( DownloadCaption );

export { VIDEO_PROJECT_PREVIEW_CAPTIONS_QUERY };
