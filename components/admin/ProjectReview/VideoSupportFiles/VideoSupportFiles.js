import React from 'react';
import PropTypes from 'prop-types';
import { gql } from '@apollo/client';
import { graphql } from '@apollo/client/react/hoc';
import orderBy from 'lodash/orderBy';
import { Icon, Loader } from 'semantic-ui-react';

import { getCount } from 'lib/utils';
import VideoSupportFilesItem from './VideoSupportFilesItem/VideoSupportFilesItem';

import './VideoSupportFiles.scss';

const VideoSupportFiles = props => {
  const { error, loading, project } = props.data;

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
          content="Loading support file(s)..."
        />
      </div>
    );
  }

  if ( error ) {
    return (
      <div className="video-support-files error">
        <p>
          <Icon color="red" name="exclamation triangle" />
          <span>Loading error...</span>
        </p>
      </div>
    );
  }

  if ( !project || !Object.keys( project ).length ) return null;

  const { srts, additionalFiles, thumbnails } = project;

  const srtsCount = getCount( srts );
  const additionalFilesCount = getCount( additionalFiles );
  const thumbnailsCount = getCount( thumbnails );
  const totalFilesCount = srtsCount + additionalFilesCount + thumbnailsCount;

  const hasSRTs = srtsCount > 0;
  const hasAdditionalFiles = additionalFilesCount > 0;
  const hasThumbnails = thumbnailsCount > 0;
  const hasSupportFiles = totalFilesCount > 0;

  const additionalFilesSorted = hasAdditionalFiles
    ? orderBy( additionalFiles, ['filetype'] )
    : [];

  const allAdditionalFiles = hasThumbnails
    ? [...additionalFilesSorted, ...thumbnails]
    : [...additionalFilesSorted];

  if ( !hasSupportFiles ) return null;

  return (
    <section className="section section--project_support-files project_support-files">
      <h3 className="uppercase">
        { `Support File${totalFilesCount > 1 ? 's' : ''}` }
      </h3>

      { hasSRTs
        && (
          <section className="files section">
            <h4 id="srt-files">
              { `SRT file${srtsCount > 1 ? 's' : ''}` }
            </h4>
            <ul aria-describedby="srt-files">
              { srts.map( srt => (
                <VideoSupportFilesItem key={ srt.id } file={ srt } />
              ) ) }
            </ul>
          </section>
        ) }

      { ( hasAdditionalFiles || hasThumbnails )
        && (
          <section className="addtl_files section">
            <h4 id="additional-files">
              { `Additional file${additionalFilesCount + thumbnailsCount > 1 ? 's' : ''}` }
            </h4>
            <ul aria-describedby="additional-files">
              { allAdditionalFiles.map( file => (
                <VideoSupportFilesItem key={ file.id } file={ file } />
              ) ) }
            </ul>
          </section>
        ) }
    </section>
  );
};

VideoSupportFiles.propTypes = {
  id: PropTypes.string, // eslint-disable-line
  data: PropTypes.object,
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      srts: supportFiles(
        where: {
          OR: [
            { filename_ends_with: "srt" },
            { filetype_contains: "application/x-subrip" }
          ]
        },
        orderBy: filename_ASC
      ) {
        id
        filename
        language {
          id
          displayName
        }
      }
      additionalFiles: supportFiles(
        where: {
          OR: [
            { filename_not_ends_with: "srt" },
            { filetype_not_contains: "application/x-subrip" }
          ]
        },
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        language {
          id
          displayName
        }
      }
      thumbnails( orderBy: filename_ASC ) {
        id
        filename
        language {
          id
          displayName
        }
      }
    }
  }
`;

export default graphql( VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id,
    },
    fetchPolicy: 'no-cache',
  } ),
} )( VideoSupportFiles );

export { VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY };
