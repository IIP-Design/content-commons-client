/**
 *
 * VideoSupportFiles
 *
 */
import React from 'react';
import { bool, func, object } from 'prop-types';
import gql from 'graphql-tag';
import { graphql } from 'react-apollo';
import orderBy from 'lodash/orderBy';
import { Checkbox } from 'semantic-ui-react';

import './VideoSupportFiles.scss';

const VideoSupportFiles = props => {
  const { disableRightClick, toggleDisableRightClick } = props;
  const { error, loading, project } = props.data;

  if ( loading ) return 'Loading the project...';
  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const { srts, additionalFiles } = project;
  const additionalFilesSorted = orderBy( additionalFiles, ['filetype'] );

  return (
    <section className="section section--project_support-files project_support-files">
      <h3>SUPPORT FILES</h3>
      <section className="files section">
        <p className="label">SRT files</p>
        { srts.map( srt => (
          <p key={ srt.id } className="file">
            <span className="label">{ srt.language.displayName }:</span> { srt.filename }
          </p>
        ) ) }
      </section>

      <section className="addtl_files section">
        <p className="label">Additional files</p>
        { additionalFilesSorted.map( file => (
          <p key={ file.id }><span className="label">{ file.language.displayName }:</span> { file.filename }</p>
        ) ) }
      </section>

      <Checkbox
        label="Disable right-click to protect your images"
        checked={ disableRightClick }
        onClick={ toggleDisableRightClick }
      />
    </section>
  );
};

VideoSupportFiles.propTypes = {
  data: object,
  disableRightClick: bool,
  toggleDisableRightClick: func
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      srts: supportFiles(
        where: {filetype: "srt"},
        orderBy: filename_ASC
      ) {
        id
        filename
        language {
          displayName
        }
      }
      additionalFiles: supportFiles(
        where: {filetype_not: "srt"},
        orderBy: filename_ASC
      ) {
        id
        filename
        filetype
        language {
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
