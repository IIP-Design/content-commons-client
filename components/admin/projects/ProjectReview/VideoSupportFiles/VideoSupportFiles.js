import React from 'react';
import { object, string } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import orderBy from 'lodash/orderBy';
import { Icon, Loader } from 'semantic-ui-react';

import { getPluralStringOrNot } from 'lib/utils';

import './VideoSupportFiles.scss';

const VideoSupportFiles = props => {
  const { error, loading, project } = props.data;

  if ( loading ) {
    return (
      <div style={ {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '200px'
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

  const { srts, additionalFiles } = project;

  const additionalFilesSorted = ( additionalFiles && additionalFiles.length )
    ? orderBy( additionalFiles, ['filetype'] )
    : [];

  let allFiles = [];
  if ( Array.isArray( srts ) && Array.isArray( additionalFiles ) ) {
    allFiles = [...srts, ...additionalFiles];
  } else if ( Array.isArray( srts ) && !Array.isArray( additionalFiles ) ) {
    allFiles = [...srts];
  } else if ( !Array.isArray( srts ) && Array.isArray( additionalFiles ) ) {
    allFiles = [...additionalFiles];
  }

  if ( !allFiles.length ) return null;

  return (
    <section className="section section--project_support-files project_support-files">
      <h3 className="uppercase">
        { getPluralStringOrNot( allFiles, 'Support File' ) }
      </h3>

      { ( srts && srts.length > 0 )
        && (
          <section className="files section">
            <h4 id="srt-files">
              { getPluralStringOrNot( srts, 'SRT file' ) }
            </h4>
            <ul aria-describedby="srt-files">
              { srts.map( srt => (
                <li key={ srt.id } className="file">
                  <b className="label">{ srt.language.displayName }:</b> { srt.filename }
                </li>
              ) ) }
            </ul>
          </section>
        ) }

      { ( additionalFiles && additionalFiles.length > 0 )
        && (
          <section className="addtl_files section">
            <h4 id="additional-files">
              { `Additional file${additionalFilesSorted.length > 1 ? 's' : ''}` }
            </h4>
            <ul aria-describedby="additional-files">
              { additionalFilesSorted.map( file => (
                <li key={ file.id }><b className="label">{ file.language.displayName }:</b> { file.filename }</li>
              ) ) }
            </ul>
          </section>
        ) }
    </section>
  );
};

VideoSupportFiles.propTypes = {
  id: string, // eslint-disable-line
  data: object
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      protectImages
      srts: supportFiles(
        where: { filename_ends_with: "srt" },
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
        where: { filename_not_ends_with: "srt" },
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
    }
  }
`;

export default graphql( VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} )( VideoSupportFiles );

export { VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY };
