/**
 *
 * VideoSupportFiles
 *
 */
import React, { useEffect, useState } from 'react';
import { func, object, string } from 'prop-types';
import gql from 'graphql-tag';
import { compose, graphql } from 'react-apollo';
import orderBy from 'lodash/orderBy';
import { Checkbox, Loader } from 'semantic-ui-react';

import { getPluralStringOrNot } from 'lib/utils';

import './VideoSupportFiles.scss';

const VideoSupportFiles = props => {
  const { error, loading, project } = props.data;

  const [protectImages, setProtectImages] = useState( project.protectImages );

  const updateState = () => setProtectImages( project.protectImages );

  useEffect( updateState );

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

  if ( error ) return `Error! ${error.message}`;

  if ( !project || !Object.keys( project ).length ) return null;

  const handleUpdateProtectImages = () => {
    const { id, updateProtectImages } = props;
    updateProtectImages( {
      variables: {
        data: { protectImages: !protectImages },
        where: { id }
      }
    } );
  };

  const { srts, additionalFiles } = project;
  const additionalFilesSorted = orderBy( additionalFiles, ['filetype'] );

  return (
    <section className="section section--project_support-files project_support-files">
      <h3 className="uppercase">
        { getPluralStringOrNot( [...srts, ...additionalFiles], 'Support File' ) }
      </h3>

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

      <Checkbox
        label="Disable right-click to protect your images"
        checked={ !!protectImages }
        onClick={ handleUpdateProtectImages }
      />
    </section>
  );
};

VideoSupportFiles.propTypes = {
  id: string,
  data: object,
  updateProtectImages: func
};

const VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY = gql`
  query VideoProjectReviewSupportFiles($id: ID!) {
    project: videoProject(id: $id) {
      id
      protectImages
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

const UPDATE_PROTECT_IMAGES_MUTATION = gql`
  mutation UpdateProtectImages($data: VideoProjectUpdateInput!
  $where: VideoProjectWhereUniqueInput!) {
    updateVideoProject(data: $data, where: $where) {
      id
      protectImages
    }
  }
`;

const supportFilesQuery = graphql( VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY, {
  options: props => ( {
    variables: {
      id: props.id
    },
  } )
} );

const updateProtectImagesMutation = graphql(
  UPDATE_PROTECT_IMAGES_MUTATION,
  { name: 'updateProtectImages' }
);

export default compose(
  updateProtectImagesMutation,
  supportFilesQuery
)( VideoSupportFiles );

export {
  VIDEO_PROJECT_REVIEW_SUPPORT_FILES_QUERY,
  UPDATE_PROTECT_IMAGES_MUTATION
};
